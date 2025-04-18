
        // Mock data for the application
        const affinityConcepts = [
            {
                id: 1,
                name: "Pet-Friendly",
                type: "Platform Score",
                category: "Family",
                scoreAvailable: true,
                applicableEntities: ["Property", "Destination"],
                avgScore: 7.2,
                status: "Validated",
                coverage: 72,
                definition: "Properties that welcome pets with amenities or policies that accommodate animals."
            },
            {
                id: 2,
                name: "Romantic",
                type: "Concept Score",
                category: "Adults",
                scoreAvailable: true,
                applicableEntities: ["Property", "Destination", "POI"],
                avgScore: 6.8,
                status: "Validated",
                coverage: 65,
                definition: "Properties suitable for couples seeking a romantic experience."
            },
            {
                id: 3,
                name: "Family-Friendly",
                type: "Platform Score",
                category: "Family",
                scoreAvailable: true,
                applicableEntities: ["Property", "Destination"],
                avgScore: 7.9,
                status: "Validated",
                coverage: 81,
                definition: "Properties that cater to families with children offering suitable amenities and activities."
            },
            {
                id: 4,
                name: "Luxury",
                type: "Concept Score",
                category: "Premium",
                scoreAvailable: true,
                applicableEntities: ["Property"],
                avgScore: 8.2,
                status: "Validated",
                coverage: 45,
                definition: "High-end properties offering premium amenities, services, and experiences."
            },
            {
                id: 5,
                name: "Beach Access",
                type: "Amenity Score",
                category: "Location",
                scoreAvailable: true,
                applicableEntities: ["Property"],
                avgScore: 8.7,
                status: "Validated",
                coverage: 38,
                definition: "Properties with direct or convenient access to beaches."
            },
            {
                id: 6,
                name: "Privacy",
                type: "Concept Score",
                category: "Adults",
                scoreAvailable: true,
                applicableEntities: ["Property"],
                avgScore: 7.5,
                status: "In Enrichment",
                coverage: 62,
                definition: "Properties offering secluded or private accommodations away from crowds."
            },
            {
                id: 7,
                name: "Nature Retreat",
                type: "Concept Score",
                category: "Outdoors",
                scoreAvailable: true,
                applicableEntities: ["Property", "Destination"],
                avgScore: 7.8,
                status: "In Enrichment",
                coverage: 41,
                definition: "Properties situated in natural surroundings with minimal urban development."
            },
            {
                id: 8,
                name: "Historical",
                type: "Concept Score",
                category: "Cultural",
                scoreAvailable: true,
                applicableEntities: ["Property", "Destination", "POI"],
                avgScore: 6.9,
                status: "Validated",
                coverage: 33,
                definition: "Properties with historical significance or located in historical areas."
            }
        ];

        const properties = [
            {
                id: "PROP12345",
                name: "Oceanview Resort & Spa",
                location: "Miami Beach, FL",
                propertyType: "Hotel",
                affinityScores: [
                    { name: "Pet-Friendly", score: 7.2 },
                    { name: "Romantic", score: 8.5 },
                    { name: "Luxury", score: 9.1 },
                    { name: "Beach Access", score: 9.5 },
                    { name: "Privacy", score: 8.2 },
                    { name: "Family-Friendly", score: 6.7 }
                ]
            },
            {
                id: "PROP67890",
                name: "Mountain Lodge",
                location: "Aspen, CO",
                propertyType: "Resort",
                affinityScores: [
                    { name: "Pet-Friendly", score: 8.7 },
                    { name: "Family-Friendly", score: 7.6 },
                    { name: "Nature Retreat", score: 9.3 },
                    { name: "Privacy", score: 8.8 },
                    { name: "Luxury", score: 8.1 }
                ]
            },
            {
                id: "PROP24680",
                name: "City Center Suites",
                location: "New York, NY",
                propertyType: "Hotel",
                affinityScores: [
                    { name: "Luxury", score: 8.3 },
                    { name: "Pet-Friendly", score: 6.1 },
                    { name: "Historical", score: 7.5 },
                    { name: "Romantic", score: 7.2 }
                ]
            }
        ];

        const lifecycleData = {
            "Pet-Friendly": {
                stages: {
                    "Discovery": { status: "Complete", lastUpdated: "2024-06-15", owner: "Jane Smith" },
                    "Relationship Definition": { status: "Complete", lastUpdated: "2024-07-22", owner: "Jane Smith" },
                    "Concept Enrichment": { status: "Complete", lastUpdated: "2024-08-10", owner: "Alex Johnson" },
                    "Weighting Finalized": { status: "Complete", lastUpdated: "2024-09-05", owner: "Alex Johnson" },
                    "Scoring Implemented": { status: "Complete", lastUpdated: "2024-10-01", owner: "Michael Chang" },
                    "Validation & Distribution": { status: "Complete", lastUpdated: "2024-10-20", owner: "Sarah Wilson" }
                }
            },
            "Romantic": {
                stages: {
                    "Discovery": { status: "Complete", lastUpdated: "2024-05-10", owner: "Sarah Wilson" },
                    "Relationship Definition": { status: "Complete", lastUpdated: "2024-06-18", owner: "Alex Johnson" },
                    "Concept Enrichment": { status: "Complete", lastUpdated: "2024-07-15", owner: "Jane Smith" },
                    "Weighting Finalized": { status: "Complete", lastUpdated: "2024-08-20", owner: "Alex Johnson" },
                    "Scoring Implemented": { status: "Complete", lastUpdated: "2024-09-12", owner: "Michael Chang" },
                    "Validation & Distribution": { status: "Complete", lastUpdated: "2024-10-05", owner: "Sarah Wilson" }
                }
            },
            "Family-Friendly": {
                stages: {
                    "Discovery": { status: "Complete", lastUpdated: "2024-07-05", owner: "Jane Smith" },
                    "Relationship Definition": { status: "Complete", lastUpdated: "2024-08-12", owner: "Jane Smith" },
                    "Concept Enrichment": { status: "Complete", lastUpdated: "2024-09-08", owner: "Alex Johnson" },
                    "Weighting Finalized": { status: "In Progress", lastUpdated: "2024-10-20", owner: "Alex Johnson" },
                    "Scoring Implemented": { status: "Not Started", lastUpdated: "", owner: "" },
                    "Validation & Distribution": { status: "Not Started", lastUpdated: "", owner: "" }
                }
            },
            "Luxury": {
                stages: {
                    "Discovery": { status: "Complete", lastUpdated: "2024-04-10", owner: "Michael Chang" },
                    "Relationship Definition": { status: "Complete", lastUpdated: "2024-05-15", owner: "Sarah Wilson" },
                    "Concept Enrichment": { status: "Complete", lastUpdated: "2024-06-22", owner: "Alex Johnson" },
                    "Weighting Finalized": { status: "Complete", lastUpdated: "2024-07-30", owner: "Alex Johnson" },
                    "Scoring Implemented": { status: "Complete", lastUpdated: "2024-08-25", owner: "Michael Chang" },
                    "Validation & Distribution": { status: "In Progress", lastUpdated: "2024-10-15", owner: "Sarah Wilson" }
                }
            }
        };

        // DOM Ready
        document.addEventListener('DOMContentLoaded', function() {
            // Toggle sidebar
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            const sidebarTexts = document.querySelectorAll('.sidebar-text');
            const toggleSidebar = document.getElementById('toggleSidebar');
            
            toggleSidebar.addEventListener('click', function() {
                sidebar.classList.toggle('sidebar-collapsed');
                mainContent.classList.toggle('main-content-expanded');
                
                sidebarTexts.forEach(text => {
                    text.classList.toggle('hidden');
                });
            });
            
            // Tab Navigation
            const navItems = document.querySelectorAll('.nav-item');
            const tabContents = document.querySelectorAll('.tab-content');
            
            navItems.forEach(item => {
                item.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    
                    // Remove active class from all nav items
                    navItems.forEach(nav => nav.classList.remove('active'));
                    
                    // Add active class to current nav item
                    this.classList.add('active');
                    
                    // Hide all tab contents
                    tabContents.forEach(tab => tab.classList.remove('active'));
                    
                    // Show the selected tab content
                    const activeTab = document.getElementById(`${tabId}-tab`);
                    if (activeTab) {
                        activeTab.classList.add('active');
                    }
                });
            });
            
            // Recent cards in Dashboard
            const recentCards = document.querySelectorAll('.recent-card');
            recentCards.forEach(card => {
                card.addEventListener('click', function() {
                    const affinityName = this.getAttribute('data-name');
                    alert(`Viewing details for ${affinityName}`);
                    
                    // Switch to library tab and select this affinity
                    document.querySelector('[data-tab="library"]').click();
                    
                    // Find and select the affinity
                    const affinityCards = document.querySelectorAll('.affinity-card');
                    affinityCards.forEach(ac => {
                        if (ac.querySelector('h4').textContent === affinityName) {
                            ac.click();
                        }
                    });
                });
            });
            
            // Favorite cards in Dashboard
            const favoriteCards = document.querySelectorAll('.favorite-card');
            favoriteCards.forEach(card => {
                card.addEventListener('click', function() {
                    const collectionName = this.querySelector('h4').textContent;
                    alert(`Opening collection: ${collectionName}`);
                });
            });
            
            // Populate Affinity Library
            const affinityContainer = document.getElementById('affinity-container');
            const affinitySearch = document.getElementById('affinity-search');
            const categoryFilter = document.getElementById('category-filter');
            const statusFilter = document.getElementById('status-filter');
            
            function getStatusClass(status) {
                switch(status) {
                    case 'Validated': return 'badge-validated';
                    case 'In Enrichment': return 'badge-enrichment';
                    case 'Scoring': return 'badge-scoring';
                    case 'Discovery': return 'badge-discovery';
                    default: return '';
                }
            }
            
            function populateAffinities(affinities) {
                if (!affinityContainer) return;
                
                affinityContainer.innerHTML = '';
                
                affinities.forEach(affinity => {
                    const card = document.createElement('div');
                    card.className = 'card p-4 affinity-card';
                    card.setAttribute('data-id', affinity.id);
                    
                    const statusClass = getStatusClass(affinity.status);
                    
                    card.innerHTML = `
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="font-semibold">${affinity.name}</h4>
                            <span class="badge ${statusClass}">${affinity.status}</span>
                        </div>
                        <p class="text-sm text-gray-600 mb-3">${affinity.definition}</p>
                        <div class="flex justify-between text-xs text-gray-500">
                            <span>Score: ${affinity.avgScore}/10</span>
                            <span>Coverage: ${affinity.coverage}%</span>
                        </div>
                    `;
                    
                    card.addEventListener('click', function() {
                        // Remove selected class from all cards
                        document.querySelectorAll('.affinity-card').forEach(c => {
                            c.classList.remove('selected');
                        });
                        
                        // Add selected class to clicked card
                        this.classList.add('selected');
                        
                        // Show affinity details
                        showAffinityDetails(affinity);
                    });
                    
                    affinityContainer.appendChild(card);
                });
            }
            
            function showAffinityDetails(affinity) {
                const detailsSection = document.getElementById('affinity-details');
                if (!detailsSection) return;
                
                detailsSection.classList.remove('hidden');
                
                document.getElementById('detail-name').textContent = affinity.name;
                document.getElementById('detail-definition').textContent = affinity.definition;
                document.getElementById('detail-status').textContent = affinity.status;
                document.getElementById('detail-status').className = `badge ${getStatusClass(affinity.status)}`;
                
                document.getElementById('detail-category').textContent = affinity.category;
                document.getElementById('detail-type').textContent = affinity.type;
                document.getElementById('detail-entities').textContent = affinity.applicableEntities.join(', ');
                document.getElementById('detail-score').textContent = `${affinity.avgScore}/10`;
                document.getElementById('detail-coverage').textContent = `${affinity.coverage}%`;
                
                // Populate related concepts
                const relatedContainer = document.getElementById('detail-related');
                relatedContainer.innerHTML = '';
                
                let relatedConcepts = [];
                
                // Mock related concepts based on the current affinity
                switch(affinity.name) {
                    case 'Pet-Friendly':
                        relatedConcepts = ['Family-Friendly', 'Spacious', 'Outdoor Recreation'];
                        break;
                    case 'Romantic':
                        relatedConcepts = ['Privacy', 'Luxury', 'Beach Access'];
                        break;
                    case 'Family-Friendly':
                        relatedConcepts = ['Pet-Friendly', 'Spacious', 'Safety'];
                        break;
                    case 'Luxury':
                        relatedConcepts = ['Premium', 'Upscale Dining', 'Romantic'];
                        break;
                    case 'Beach Access':
                        relatedConcepts = ['Ocean View', 'Luxury', 'Romantic'];
                        break;
                    default:
                        relatedConcepts = ['Example Related Concept 1', 'Example Related Concept 2'];
                }
                
                relatedConcepts.forEach(concept => {
                    const div = document.createElement('div');
                    div.className = 'py-1';
                    div.innerHTML = `<i class="fas fa-link text-blue-500 mr-2"></i> ${concept}`;
                    div.style.cursor = 'pointer';
                    div.addEventListener('click', function() {
                        alert(`Viewing details for ${concept}`);
                    });
                    relatedContainer.appendChild(div);
                });
            }
            
            if (affinitySearch) {
                affinitySearch.addEventListener('input', function(e) {
                    filterAffinities();
                });
            }
            
            if (categoryFilter) {
                categoryFilter.addEventListener('change', function() {
                    filterAffinities();
                });
            }
            
            if (statusFilter) {
                statusFilter.addEventListener('change', function() {
                    filterAffinities();
                });
            }
            
            function filterAffinities() {
                const searchValue = affinitySearch ? affinitySearch.value.toLowerCase() : '';
                const categoryValue = categoryFilter ? categoryFilter.value : 'all';
                const statusValue = statusFilter ? statusFilter.value : 'all';
                
                let filtered = [...affinityConcepts];
                
                // Apply search filter
                if (searchValue) {
                    filtered = filtered.filter(
                        affinity => 
                            affinity.name.toLowerCase().includes(searchValue) ||
                            affinity.definition.toLowerCase().includes(searchValue) ||
                            affinity.category.toLowerCase().includes(searchValue)
                    );
                }
                
                // Apply category filter
                if (categoryValue !== 'all') {
                    filtered = filtered.filter(affinity => affinity.category === categoryValue);
                }
                
                // Apply status filter
                if (statusValue !== 'all') {
                    filtered = filtered.filter(affinity => affinity.status === statusValue);
                }
                
                populateAffinities(filtered);
            }
            
            // Initial population of affinities
            populateAffinities(affinityConcepts);
            
            // Populate Properties
            const propertyContainer = document.getElementById('property-container');
            const propertySearch = document.getElementById('property-search');
            const propertyFilter = document.getElementById('property-filter');
            const searchPropertyBtn = document.getElementById('search-property-btn');
            
            function getScoreClass(score) {
                if (score >= 9) return 'score-high';
                if (score >= 7.5) return 'score-medium';
                if (score >= 6) return 'score-low';
                return 'score-low';
            }
            
            function populateProperties(properties) {
                if (!propertyContainer) return;
                
                propertyContainer.innerHTML = '';
                
                properties.forEach(property => {
                    const card = document.createElement('div');
                    card.className = 'card p-4 property-card';
                    card.setAttribute('data-id', property.id);
                    
                    card.innerHTML = `
                        <div class="flex justify-between items-start">
                            <h4 class="font-semibold">${property.name}</h4>
                            <span class="text-xs px-2 py-1 bg-gray-100 rounded-full">
                                ${property.propertyType}
                            </span>
                        </div>
                        <p class="text-sm text-gray-600">${property.location}</p>
                        <p class="text-xs text-gray-500 mt-1">ID: ${property.id}</p>
                        <p class="text-sm mt-2">${property.affinityScores.length} Affinity Scores</p>
                    `;
                    
                    card.addEventListener('click', function() {
                        // Remove selected class from all cards
                        document.querySelectorAll('.property-card').forEach(c => {
                            c.classList.remove('selected');
                        });
                        
                        // Add selected class to clicked card
                        this.classList.add('selected');
                        
                        // Show property details
                        showPropertyDetails(property);
                    });
                    
                    propertyContainer.appendChild(card);
                });
            }
            
            function showPropertyDetails(property) {
                const detailsSection = document.getElementById('property-details');
                if (!detailsSection) return;
                
                detailsSection.classList.remove('hidden');
                
                document.getElementById('detail-property-name').textContent = property.name;
                document.getElementById('detail-property-location').textContent = `${property.location} • ${property.propertyType}`;
                document.getElementById('detail-property-id').textContent = `ID: ${property.id}`;
                
                // Property scores
                const scoresContainer = document.getElementById('property-scores');
                scoresContainer.innerHTML = '';
                
                const sortedScores = [...property.affinityScores].sort((a, b) => b.score - a.score);
                
                sortedScores.forEach(score => {
                    const scoreClass = getScoreClass(score.score);
                    
                    const div = document.createElement('div');
                    div.className = 'border rounded-md p-3';
                    div.innerHTML = `
                        <div class="flex justify-between items-center">
                            <h4 class="font-medium">${score.name}</h4>
                            <span class="px-2 py-1 rounded-full text-sm font-medium ${scoreClass}">
                                ${score.score}/10
                            </span>
                        </div>
                    `;
                    
                    scoresContainer.appendChild(div);
                });
                
                // Property analysis
                const analysisContainer = document.getElementById('property-analysis');
                if (analysisContainer) {
                    const highestScore = sortedScores[0].score;
                    const highestScoreName = sortedScores[0].name;
                    const avgScore = (property.affinityScores.reduce((sum, score) => sum + score.score, 0) / property.affinityScores.length).toFixed(1);
                    
                    analysisContainer.innerHTML = `
                        <li>
                            <strong>Highest Score:</strong> ${highestScore.toFixed(1)}/10 (${highestScoreName})
                        </li>
                        <li>
                            <strong>Average Score:</strong> ${avgScore}/10
                        </li>
                        <li>
                            <strong>Total Affinities:</strong> ${property.affinityScores.length}
                        </li>
                    `;
                }
                
                // Property breakdown
                const breakdownContainer = document.getElementById('property-breakdown');
                if (breakdownContainer) {
                    breakdownContainer.innerHTML = '';
                    
                    sortedScores.forEach(score => {
                        let interpretation = '';
                        
                        if (score.score >= 9) {
                            interpretation = 'Exceptional match';
                        } else if (score.score >= 7.5) {
                            interpretation = 'Strong match';
                        } else if (score.score >= 6) {
                            interpretation = 'Good match';
                        } else {
                            interpretation = 'Average match';
                        }
                        
                        const scoreClass = getScoreClass(score.score);
                        
                        const row = document.createElement('tr');
                        row.className = 'border-t';
                        row.innerHTML = `
                            <td class="px-4 py-2 border">${score.name}</td>
                            <td class="px-4 py-2 border">
                                <span class="px-2 py-1 rounded-full text-xs font-medium ${scoreClass}">
                                    ${score.score}/10
                                </span>
                            </td>
                            <td class="px-4 py-2 border text-sm">${interpretation}</td>
                        `;
                        
                        breakdownContainer.appendChild(row);
                    });
                }
            }
            
            if (searchPropertyBtn) {
                searchPropertyBtn.addEventListener('click', function() {
                    const searchValue = propertySearch.value.trim();
                    const errorMessage = document.getElementById('property-search-error');
                    
                    if (!searchValue) {
                        errorMessage.textContent = "Please enter a property ID or name.";
                        errorMessage.classList.remove('hidden');
                        return;
                    }
                    
                    const property = properties.find(p => 
                        p.id.toLowerCase() === searchValue.toLowerCase() ||
                        p.name.toLowerCase().includes(searchValue.toLowerCase())
                    );
                    
                    if (property) {
                        errorMessage.classList.add('hidden');
                        showPropertyDetails(property);
                        
                        // Select the property card if it exists
                        document.querySelectorAll('.property-card').forEach(c => {
                            c.classList.remove('selected');
                            if (c.getAttribute('data-id') === property.id) {
                                c.classList.add('selected');
                                c.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        });
                    } else {
                        errorMessage.textContent = `No property found with ID or name: ${searchValue}`;
                        errorMessage.classList.remove('hidden');
                    }
                });
            }
            
            if (propertyFilter) {
                propertyFilter.addEventListener('input', function(e) {
                    const filterValue = e.target.value.toLowerCase();
                    
                    if (!filterValue) {
                        populateProperties(properties);
                        return;
                    }
                    
                    const filtered = properties.filter(
                        property => 
                            property.name.toLowerCase().includes(filterValue) ||
                            property.location.toLowerCase().includes(filterValue)
                    );
                    
                    populateProperties(filtered);
                });
            }
            
            // Initial population of properties
            populateProperties(properties);
            
            // Populate Lifecycle Tracker
            const lifecycleContainer = document.getElementById('lifecycle-container');
            const lifecycleFilter = document.getElementById('lifecycle-filter');
            
            function getLifecycleStatusClass(status) {
                switch(status) {
                    case 'Complete': return 'badge-validated';
                    case 'In Progress': return 'badge-enrichment';
                    case 'Not Started': return '';
                    default: return '';
                }
            }
            
            function populateLifecycles(lifecycles) {
                if (!lifecycleContainer) return;
                
                lifecycleContainer.innerHTML = '';
                
                Object.keys(lifecycles).forEach(conceptName => {
                    const lifecycle = lifecycles[conceptName];
                    const stages = lifecycle.stages || {};
                    const totalStages = 6; // Total number of possible stages
                    const completedStages = Object.values(stages).filter(stage => stage.status === "Complete").length;
                    const progressPercentage = (completedStages / totalStages) * 100;
                    
                    const card = document.createElement('div');
                    card.className = 'card p-4 lifecycle-card';
                    card.setAttribute('data-name', conceptName);
                    
                    let progressFillClass = 'progress-fill';
                    if (progressPercentage === 100) {
                        progressFillClass += ' progress-fill-success';
                    } else if (progressPercentage > 50) {
                        progressFillClass += ' progress-fill-warning';
                    }
                    
                    card.innerHTML = `
                        <h4 class="font-semibold">${conceptName}</h4>
                        <div class="mt-3">
                            <div class="progress-bar">
                                <div class="${progressFillClass}" style="width: ${progressPercentage}%"></div>
                            </div>
                            <p class="text-sm text-gray-600 mt-1">
                                ${completedStages} of ${totalStages} stages complete (${progressPercentage.toFixed(0)}%)
                            </p>
                        </div>
                    `;
                    
                    card.addEventListener('click', function() {
                        // Remove selected class from all cards
                        document.querySelectorAll('.lifecycle-card').forEach(c => {
                            c.classList.remove('selected');
                        });
                        
                        // Add selected class to clicked card
                        this.classList.add('selected');
                        
                        // Show lifecycle details
                        showLifecycleDetails(conceptName, lifecycle);
                    });
                    
                    lifecycleContainer.appendChild(card);
                });
            }
            
            function showLifecycleDetails(conceptName, lifecycle) {
                const detailsSection = document.getElementById('lifecycle-details');
                if (!detailsSection) return;
                
                detailsSection.classList.remove('hidden');
                
                document.getElementById('detail-lifecycle-name').textContent = `Lifecycle Stages: ${conceptName}`;
                
                // Lifecycle stages
                const stagesContainer = document.getElementById('lifecycle-stages');
                stagesContainer.innerHTML = '';
                
                const stageNames = ["Discovery", "Relationship Definition", "Concept Enrichment", 
                                   "Weighting Finalized", "Scoring Implemented", "Validation & Distribution"];
                
                stageNames.forEach(stageName => {
                    const stageData = lifecycle.stages[stageName] || { status: "Not Started", lastUpdated: "", owner: "" };
                    const statusClass = getLifecycleStatusClass(stageData.status);
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="px-4 py-2 border">${stageName}</td>
                        <td class="px-4 py-2 border">
                            <span class="inline-flex px-2 py-1 text-xs rounded-full ${statusClass}">
                                ${stageData.status}
                            </span>
                        </td>
                        <td class="px-4 py-2 border">${stageData.lastUpdated || "—"}</td>
                        <td class="px-4 py-2 border">${stageData.owner || "—"}</td>
                    `;
                    
                    stagesContainer.appendChild(row);
                });
            }
            
            if (lifecycleFilter) {
                lifecycleFilter.addEventListener('change', function(e) {
                    const filterValue = e.target.value;
                    
                    if (filterValue === 'all') {
                        populateLifecycles(lifecycleData);
                        return;
                    }
                    
                    const filtered = {};
                    
                    Object.keys(lifecycleData).forEach(conceptName => {
                        const lifecycle = lifecycleData[conceptName];
                        const stages = lifecycle.stages || {};
                        const completedStages = Object.values(stages).filter(stage => stage.status === "Complete").length;
                        const totalStages = 6; // Total number of possible stages
                        
                        if (filterValue === 'complete' && completedStages === totalStages) {
                            filtered[conceptName] = lifecycle;
                        } else if (filterValue === 'in-progress' && completedStages > 0 && completedStages < totalStages) {
                            filtered[conceptName] = lifecycle;
                        } else if (filterValue === 'not-started' && completedStages === 0) {
                            filtered[conceptName] = lifecycle;
                        }
                    });
                    
                    populateLifecycles(filtered);
                });
            }
            
            // Initial population of lifecycles
            populateLifecycles(lifecycleData);
            
            // Affinity Combination
            const availableAffinitiesContainer = document.getElementById('available-affinities');
            const selectedAffinitiesContainer = document.getElementById('selected-affinities');
            const clearCombination = document.getElementById('clear-combination');
            const noCombinationMessage = document.getElementById('no-combination-message');
            const combinationAnalysis = document.getElementById('combination-analysis');
            const emptySelection = document.getElementById('empty-selection');
            const matchingProperties = document.getElementById('matching-properties');
            const compatibilityScore = document.getElementById('compatibility-score');
            const compatibilityBar = document.getElementById('compatibility-bar');
            
            const selectedAffinities = [];
            
            function populateAvailableAffinities() {
                if (!availableAffinitiesContainer) return;
                
                availableAffinitiesContainer.innerHTML = '';
                
                affinityConcepts.forEach(affinity => {
                    if (selectedAffinities.includes(affinity.name)) return;
                    
                    const affinityTag = document.createElement('div');
                    affinityTag.className = 'affinity-tag';
                    affinityTag.textContent = affinity.name;
                    
                    affinityTag.addEventListener('click', function() {
                        addToCombination(affinity.name);
                    });
                    
                    availableAffinitiesContainer.appendChild(affinityTag);
                });
            }
            
            function updateSelectedAffinities() {
                if (!selectedAffinitiesContainer) return;
                
                selectedAffinitiesContainer.innerHTML = '';
                
                if (selectedAffinities.length === 0) {
                    selectedAffinitiesContainer.appendChild(emptySelection);
                    if (noCombinationMessage) noCombinationMessage.classList.remove('hidden');
                    if (combinationAnalysis) combinationAnalysis.classList.add('hidden');
                    return;
                }
                
                emptySelection.remove();
                
                selectedAffinities.forEach(affinityName => {
                    const affinityTag = document.createElement('div');
                    affinityTag.className = 'affinity-tag selected';
                    affinityTag.textContent = affinityName;
                    
                    const removeIcon = document.createElement('i');
                    removeIcon.className = 'fas fa-times ml-2';
                    affinityTag.appendChild(removeIcon);
                    
                    affinityTag.addEventListener('click', function() {
                        removeFromCombination(affinityName);
                    });
                    
                    selectedAffinitiesContainer.appendChild(affinityTag);
                });
                
                if (selectedAffinities.length >= 2) {
                    if (noCombinationMessage) noCombinationMessage.classList.add('hidden');
                    if (combinationAnalysis) combinationAnalysis.classList.remove('hidden');
                    updateCombinationAnalysis();
                } else {
                    if (noCombinationMessage) noCombinationMessage.classList.remove('hidden');
                    if (combinationAnalysis) combinationAnalysis.classList.add('hidden');
                }
            }
            
            function addToCombination(affinityName) {
                if (!selectedAffinities.includes(affinityName)) {
                    selectedAffinities.push(affinityName);
                    updateSelectedAffinities();
                    populateAvailableAffinities();
                }
            }
            
            function removeFromCombination(affinityName) {
                const index = selectedAffinities.indexOf(affinityName);
                if (index !== -1) {
                    selectedAffinities.splice(index, 1);
                    updateSelectedAffinities();
                    populateAvailableAffinities();
                }
            }
            
            function updateCombinationAnalysis() {
                if (!matchingProperties || !compatibilityScore || !compatibilityBar) return;
                
                // Generate random compatibility score between 70-95
                const score = Math.floor(70 + Math.random() * 25);
                compatibilityScore.textContent = `${score}%`;
                compatibilityBar.style.width = `${score}%`;
                
                // Mock matching properties
                matchingProperties.innerHTML = '';
                
                const mockProperties = [
                    { name: "Oceanview Resort & Spa", score: 9.2 },
                    { name: "Mountain Lodge", score: 8.7 },
                    { name: "City Center Suites", score: 7.5 }
                ];
                
                mockProperties.forEach(property => {
                    const div = document.createElement('div');
                    div.className = 'flex justify-between items-center py-1';
                    div.innerHTML = `
                        <span class="text-sm">${property.name}</span>
                        <span class="text-xs font-medium px-2 py-1 rounded-full ${getScoreClass(property.score)}">
                            ${property.score}/10
                        </span>
                    `;
                    
                    div.addEventListener('click', function() {
                        alert(`Viewing details for ${property.name}`);
                    });
                    
                    matchingProperties.appendChild(div);
                });
            }
            
            if (clearCombination) {
                clearCombination.addEventListener('click', function() {
                    selectedAffinities.length = 0;
                    updateSelectedAffinities();
                    populateAvailableAffinities();
                });
            }
            
            // Initialize combination tool
            if (availableAffinitiesContainer) {
                populateAvailableAffinities();
                updateSelectedAffinities();
            }
            
            // Agent View Functionality
            const agentTabs = document.querySelectorAll('.agent-tab');
            const agentContents = document.querySelectorAll('.agent-content');
            const agentPropertyCards = document.querySelectorAll('.agent-property-card');
            const noPropertySelected = document.getElementById('no-property-selected');
            const agentPropertyContent = document.getElementById('agent-property-content');
            const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
            const collapsibleSections = document.querySelectorAll('.collapsible-section');
            
            // Agent tabs
            agentTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const agentId = this.getAttribute('data-agent');
                    
                    // Remove active class from all tabs
                    agentTabs.forEach(t => t.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    this.classList.add('active');
                    
                    // Hide all content
                    agentContents.forEach(content => content.classList.add('hidden'));
                    
                    // Show selected content
                    const activeContent = document.getElementById(`${agentId}-content`);
                    if (activeContent) {
                        activeContent.classList.remove('hidden');
                    }
                });
            });
            
            // Agent property cards
            agentPropertyCards.forEach(card => {
                card.addEventListener('click', function() {
                    const propertyId = this.getAttribute('data-property');
                    
                    // Remove selected class from all cards
                    agentPropertyCards.forEach(c => c.classList.remove('selected'));
                    
                    // Add selected class to clicked card
                    this.classList.add('selected');
                    
                    // Show property content and hide no-property message
                    if (noPropertySelected) noPropertySelected.classList.add('hidden');
                    if (agentPropertyContent) agentPropertyContent.classList.remove('hidden');
                    
                    // Update property names in all agent views
                    document.querySelectorAll('[id$="-property-name"]').forEach(el => {
                        if (propertyId === 'oceanview') {
                            el.textContent = 'Oceanview Resort & Spa';
                        } else if (propertyId === 'mountain') {
                            el.textContent = 'Mountain Lodge';
                        } else if (propertyId === 'city') {
                            el.textContent = 'City Center Suites';
                        }
                    });
                });
            });
            
            // Collapsible sections
            collapsibleHeaders.forEach(header => {
                header.addEventListener('click', function() {
                    const content = this.nextElementSibling;
                    content.classList.toggle('expanded');
                    
                    // Toggle icon
                    const icon = this.querySelector('i');
                    if (icon) {
                        if (content.classList.contains('expanded')) {
                            icon.classList.remove('fa-chevron-down');
                            icon.classList.add('fa-chevron-up');
                        } else {
                            icon.classList.remove('fa-chevron-up');
                            icon.classList.add('fa-chevron-down');
                        }
                    }
                });
            });
            
            collapsibleSections.forEach(section => {
                const header = section.querySelector('div');
                const content = header.nextElementSibling;
                
                header.addEventListener('click', function() {
                    content.classList.toggle('expanded');
                    
                    // Toggle icon
                    const icon = this.querySelector('i');
                    if (icon) {
                        if (content.classList.contains('expanded')) {
                            icon.classList.remove('fa-chevron-down');
                            icon.classList.add('fa-chevron-up');
                        } else {
                            icon.classList.remove('fa-chevron-up');
                            icon.classList.add('fa-chevron-down');
                        }
                    }
                });
            });
            
            // FAQ items
            const faqItems = document.querySelectorAll('.faq-item');
            
            faqItems.forEach(item => {
                const question = item.querySelector('div');
                const answer = item.querySelector('.faq-answer');
                
                question.addEventListener('click', function() {
                    answer.classList.toggle('hidden');
                    
                    // Toggle icon
                    const icon = this.querySelector('i');
                    if (icon) {
                        if (answer.classList.contains('hidden')) {
                            icon.classList.remove('fa-chevron-up');
                            icon.classList.add('fa-chevron-down');
                        } else {
                            icon.classList.remove('fa-chevron-down');
                            icon.classList.add('fa-chevron-up');
                        }
                    }
                });
            });
        });
    