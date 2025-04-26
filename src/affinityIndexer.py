#!/usr/bin/env python3
"""
Affinity Indexer Script

Builds a ChromaDB vector index for affinity concepts using sentence-transformers.
Features:
- Input validation and deduplication
- Batch processing for large datasets
- Configurable via command-line arguments
- Metadata enrichment and normalization
- Progress and summary reporting
"""

import json
import os
import sys
import argparse
import logging
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
import chromadb

# ------------------- CONFIGURATION -------------------

DEFAULT_MODEL_NAME = "all-MiniLM-L6-v2"
DEFAULT_INPUT_JSON = "data/affinity_definitions.json"
DEFAULT_CONFIG_JSON = "config/affinity_config.json"
DEFAULT_CHROMA_PATH = "./chroma_db"
DEFAULT_COLLECTION_NAME = "affinities"
BATCH_SIZE = 128

# ------------------- LOGGING SETUP -------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

# ------------------- UTILITY FUNCTIONS -------------------

def extract_text(affinity: Dict[str, Any]) -> str:
    """Extracts and concatenates relevant text fields for embedding."""
    parts = [
        affinity.get("input_concept", ""),
        affinity.get("normalized_concept", ""),
        affinity.get("travel_category", {}).get("prefLabel", ""),
        affinity.get("travel_category", {}).get("skos:definition", ""),
        *[a.get("skos:prefLabel", "") for a in affinity.get("top_defining_attributes", [])]
    ]
    return ". ".join(filter(None, parts))

def normalize_tag(tag: str) -> str:
    """Normalizes a tag or subscore for consistency."""
    return tag.strip().lower().replace(" ", "_")

def validate_affinity(obj: Dict[str, Any]) -> bool:
    """Validates that the affinity object has required fields."""
    required = ["input_concept", "travel_category"]
    for field in required:
        if field not in obj or not obj[field]:
            logging.warning(f"Missing required field '{field}' in: {obj}")
            return False
    return True

def load_json(path: str) -> Any:
    """Loads a JSON file and returns its content."""
    if not os.path.exists(path):
        logging.error(f"File not found: {path}")
        sys.exit(1)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def batch_iterable(iterable, batch_size):
    """Yields batches from an iterable."""
    for i in range(0, len(iterable), batch_size):
        yield iterable[i:i + batch_size]

# ------------------- MAIN INDEXING FUNCTION -------------------

def build_chroma_index(
    input_json: str,
    config_json: str,
    chroma_path: str,
    collection_name: str,
    model_name: str,
    clear_collection: bool = True
):
    """Builds the ChromaDB index from affinity definitions."""
    logging.info("Loading data and config...")
    data = load_json(input_json)
    config = load_json(config_json)
    master_subscores = set(normalize_tag(s) for s in config.get("master_subscore_list", []))

    # Deduplicate by input_concept
    seen_ids = set()
    affinities = []
    for obj in data:
        if not validate_affinity(obj):
            continue
        concept_id = obj["input_concept"]
        if concept_id in seen_ids:
            logging.warning(f"Duplicate input_concept found and skipped: {concept_id}")
            continue
        seen_ids.add(concept_id)
        affinities.append(obj)
    logging.info(f"Loaded {len(affinities)} unique, valid affinities.")

    # Prepare ChromaDB
    chroma_client = chromadb.PersistentClient(path=chroma_path)
    if clear_collection and collection_name in [c.name for c in chroma_client.list_collections()]:
        logging.info(f"Clearing existing collection '{collection_name}'...")
        chroma_client.delete_collection(name=collection_name)
    collection = chroma_client.get_or_create_collection(name=collection_name)

    # Load model
    logging.info(f"Loading embedding model: {model_name}")
    model = SentenceTransformer(model_name)

    # Prepare data for indexing
    texts, ids, metadatas = [], [], []
    for obj in affinities:
        texts.append(extract_text(obj))
        ids.append(obj["input_concept"])

        # Related tags
        related_tags = "; ".join(
            sorted(set(
                normalize_tag(attr.get("skos:prefLabel", ""))
                for attr in obj.get("top_defining_attributes", [])
                if attr.get("skos:prefLabel")
            ))
        ) or ""

        # Platform scores
        platform_scores = []
        for theme in obj.get("themes", []):
            subscore = theme.get("subScore")
            if subscore and normalize_tag(subscore) in master_subscores:
                platform_scores.append(normalize_tag(subscore))
        for subscore in obj.get("additional_relevant_subscores", []):
            if normalize_tag(subscore) in master_subscores:
                platform_scores.append(normalize_tag(subscore))
        platform_scores_str = "; ".join(sorted(set(platform_scores)))

        # Metadata enrichment
        metadatas.append({
            "input_concept": obj.get("input_concept", ""),
            "category": obj.get("travel_category", {}).get("prefLabel", ""),
            "definition": obj.get("travel_category", {}).get("skos:definition", ""),
            "lodging_type": obj.get("applicable_lodging_types", "Both"),
            "related_tags": related_tags,
            "platform_scores": platform_scores_str,
            "status": obj.get("status", "Active"),
            "date_created": obj.get("date_created", ""),
            "last_updated": obj.get("last_updated", ""),
            "source": obj.get("source", "")
        })

    # Batch embedding and indexing
    total = len(texts)
    logging.info(f"Indexing {total} affinities in batches of {BATCH_SIZE}...")
    indexed = 0
    for batch_start in range(0, total, BATCH_SIZE):
        batch_texts = texts[batch_start:batch_start+BATCH_SIZE]
        batch_ids = ids[batch_start:batch_start+BATCH_SIZE]
        batch_metas = metadatas[batch_start:batch_start+BATCH_SIZE]
        try:
            embeddings = model.encode(batch_texts, show_progress_bar=True)
        except Exception as e:
            logging.error(f"Embedding failed for batch {batch_start}-{batch_start+len(batch_texts)}: {e}")
            continue
        try:
            collection.add(
                embeddings=[emb.tolist() for emb in embeddings],
                documents=batch_texts,
                metadatas=batch_metas,
                ids=batch_ids
            )
            indexed += len(batch_texts)
            logging.info(f"Indexed {indexed}/{total} affinities...")
        except Exception as e:
            logging.error(f"ChromaDB add failed for batch {batch_start}-{batch_start+len(batch_texts)}: {e}")

    # Summary
    logging.info(f"ChromaDB index built successfully. Total indexed: {indexed}/{total}")

# ------------------- COMMAND-LINE INTERFACE -------------------

def main():
    parser = argparse.ArgumentParser(description="Build ChromaDB index for affinity concepts.")
    parser.add_argument("--input", default=DEFAULT_INPUT_JSON, help="Path to affinity definitions JSON")
    parser.add_argument("--config", default=DEFAULT_CONFIG_JSON, help="Path to affinity config JSON")
    parser.add_argument("--chroma", default=DEFAULT_CHROMA_PATH, help="Path to ChromaDB directory")
    parser.add_argument("--collection", default=DEFAULT_COLLECTION_NAME, help="ChromaDB collection name")
    parser.add_argument("--model", default=DEFAULT_MODEL_NAME, help="SentenceTransformer model name")
    parser.add_argument("--no-clear", action="store_true", help="Do not clear existing collection before indexing")
    args = parser.parse_args()

    build_chroma_index(
        input_json=args.input,
        config_json=args.config,
        chroma_path=args.chroma,
        collection_name=args.collection,
        model_name=args.model,
        clear_collection=not args.no_clear
    )

if __name__ == "__main__":
    main() 