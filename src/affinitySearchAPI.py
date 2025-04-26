#!/usr/bin/env python3

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import uvicorn
import logging

MODEL_NAME = "all-MiniLM-L6-v2"
CHROMA_PATH = "./chroma_db"
COLLECTION_NAME = "affinities"
API_VERSION = "v1"

# ------------------- LOGGING SETUP -------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

# ------------------- FASTAPI SETUP -------------------
app = FastAPI(
    title="Affinity Search API",
    version=API_VERSION,
    description="Semantic search for affinity concepts with filtering, explainability, and context support."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------- CHROMADB & MODEL INIT -------------------
chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)
collection = chroma_client.get_collection(name=COLLECTION_NAME)
model = SentenceTransformer(MODEL_NAME)

# ------------------- Pydantic Models -------------------
class SearchRequest(BaseModel):
    query: str
    context: Optional[str] = None
    filter_status: Optional[str] = "Active"
    filter_lodging_type: Optional[str] = None
    filter_category: Optional[str] = None
    min_score: Optional[float] = None
    page: Optional[int] = 1
    per_page: Optional[int] = 10

class BatchSearchRequest(BaseModel):
    queries: List[str]
    context: Optional[str] = None
    filter_status: Optional[str] = "Active"
    filter_lodging_type: Optional[str] = None
    filter_category: Optional[str] = None
    min_score: Optional[float] = None
    page: Optional[int] = 1
    per_page: Optional[int] = 10

# ------------------- HEALTH CHECK -------------------
@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "message": "Affinity Search API is healthy."}

# ------------------- FACETS ENDPOINT -------------------
@app.get(f"/{API_VERSION}/facets", tags=["Facets"])
async def get_facets():
    """Return available values for filters (category, status, lodging_type) for UI facets."""
    try:
        all_metas = collection.get(include=["metadatas"])["metadatas"]
        categories = set()
        statuses = set()
        lodging_types = set()
        for meta in all_metas:
            categories.add(meta.get("category", ""))
            statuses.add(meta.get("status", ""))
            lodging_types.add(meta.get("lodging_type", ""))
        return {
            "categories": sorted(c for c in categories if c),
            "statuses": sorted(s for s in statuses if s),
            "lodging_types": sorted(l for l in lodging_types if l)
        }
    except Exception as e:
        logging.error(f"Error in facets endpoint: {e}")
        raise HTTPException(500, "Failed to fetch facets.")

# ------------------- SEARCH ENDPOINT -------------------
@app.post(f"/{API_VERSION}/search", tags=["Search"])
async def search_affinities(req: SearchRequest):
    if not req.query:
        raise HTTPException(400, "Empty query")

    # Combine query and context for semantic search
    full_query = req.query
    if req.context:
        full_query = f"{req.query}. Context: {req.context}"

    # Build filters
    filters = []
    if req.filter_status:
        filters.append({"status": req.filter_status})
    if req.filter_lodging_type:
        filters.append({"lodging_type": req.filter_lodging_type})
    if req.filter_category:
        filters.append({"category": req.filter_category})

    if not filters:
        where_filter = {}
    elif len(filters) == 1:
        where_filter = filters[0]
    else:
        where_filter = {"$and": filters}

    # Query ChromaDB
    try:
        results = collection.query(
            query_texts=[full_query],
            n_results=req.page * req.per_page,
            where=where_filter
        )
    except Exception as e:
        logging.error(f"ChromaDB query error: {e}")
        raise HTTPException(500, "Search backend error.")

    # Build output with explainability
    output = []
    for meta, score, doc in zip(results['metadatas'][0], results['distances'][0], results['documents'][0]):
        platform_scores = meta.get("platform_scores", "").split("; ") if meta.get("platform_scores") else []
        related_tags = meta.get("related_tags", "").split("; ") if meta.get("related_tags") else []
        match_reason = []
        # Explainability: highlight which fields matched
        if req.query.lower() in (meta.get("input_concept", "").lower() or ""):
            match_reason.append("input_concept")
        if req.query.lower() in (meta.get("category", "").lower() or ""):
            match_reason.append("category")
        if any(req.query.lower() in tag.lower() for tag in related_tags):
            match_reason.append("related_tag")
        if req.context and req.context.lower() in doc.lower():
            match_reason.append("context")

        affinity = {
            "input_concept": meta.get("input_concept", "Unknown"),
            "category": meta.get("category", ""),
            "definition": meta.get("definition", ""),
            "similarity_score": round(score, 4),
            "platform_scores": platform_scores,
            "match_reason": match_reason,
            "highlight": {
                "input_concept": meta.get("input_concept", "") if "input_concept" in match_reason else None,
                "category": meta.get("category", "") if "category" in match_reason else None,
                "related_tags": [tag for tag in related_tags if req.query.lower() in tag.lower()] if "related_tag" in match_reason else [],
                "context": req.context if "context" in match_reason else None
            }
        }
        output.append(affinity)

    # Filter by min_score if provided
    if req.min_score is not None:
        output = [a for a in output if a["similarity_score"] <= req.min_score]

    # Pagination
    start = (req.page - 1) * req.per_page
    end = start + req.per_page
    paged_output = output[start:end]

    # Facets for UI
    facets = {
        "categories": sorted({a["category"] for a in output if a["category"]}),
        "platform_scores": sorted({s for a in output for s in a["platform_scores"] if s}),
    }

    return {
        "message": "These affinities are relevant to your search.",
        "results": paged_output,
        "total": len(output),
        "page": req.page,
        "per_page": req.per_page,
        "facets": facets
    }

# ------------------- BATCH SEARCH ENDPOINT -------------------
@app.post(f"/{API_VERSION}/batch_search", tags=["Search"])
async def batch_search_affinities(req: BatchSearchRequest):
    if not req.queries or not isinstance(req.queries, list):
        raise HTTPException(400, "No queries provided.")

    responses = []
    for q in req.queries:
        single_req = SearchRequest(
            query=q,
            context=req.context,
            filter_status=req.filter_status,
            filter_lodging_type=req.filter_lodging_type,
            filter_category=req.filter_category,
            min_score=req.min_score,
            page=req.page,
            per_page=req.per_page
        )
        result = await search_affinities(single_req)
        responses.append(result)
    return {"results": responses}

# ------------------- ERROR HANDLING -------------------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )

# ------------------- MAIN -------------------
if __name__ == "__main__":
    uvicorn.run("affinitySearchAPI:app", host="0.0.0.0", port=8000, reload=True) 