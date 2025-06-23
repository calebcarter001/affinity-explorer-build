// API endpoints configuration
const API_CONFIG = {
  // Base URLs
  // Read from environment variable, fallback for safety (though should be set)
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:9000',
  
  // Endpoints
  ENDPOINTS: {
    SEARCH: '/v1/search',
    // Add other endpoints as needed
  }
};

// Destination Theme Configuration
const DESTINATION_CONFIG = {
  // Available destinations with their data file mappings
  // All 25 export format destinations with full themes, nuances, and evidence data
  AVAILABLE_DESTINATIONS: [
    { 
      id: 'acropolis_greece', 
      name: 'Acropolis Greece', 
      flag: '🌍',
      dataFiles: { themes: 'export/acropolis_greece/themes.json', nuances: 'export/acropolis_greece/nuances.json', evidence: 'export/acropolis_greece/evidence.json' }
    },
    { 
      id: 'amazon_rainforest_brazil', 
      name: 'Amazon Rainforest Brazil', 
      flag: '🌍',
      dataFiles: { themes: 'export/amazon_rainforest_brazil/themes.json', nuances: 'export/amazon_rainforest_brazil/nuances.json', evidence: 'export/amazon_rainforest_brazil/evidence.json' }
    },
    { 
      id: 'amsterdam_netherlands', 
      name: 'Amsterdam Netherlands', 
      flag: '🌍',
      dataFiles: { themes: 'export/amsterdam_netherlands/themes.json', nuances: 'export/amsterdam_netherlands/nuances.json', evidence: 'export/amsterdam_netherlands/evidence.json' }
    },
    { 
      id: 'anchorage_alaska', 
      name: 'Anchorage Alaska', 
      flag: '🌍',
      dataFiles: { themes: 'export/anchorage_alaska/themes.json', nuances: 'export/anchorage_alaska/nuances.json', evidence: 'export/anchorage_alaska/evidence.json' }
    },
    { 
      id: 'antelope_canyon_usa', 
      name: 'Antelope Canyon Usa', 
      flag: '🌍',
      dataFiles: { themes: 'export/antelope_canyon_usa/themes.json', nuances: 'export/antelope_canyon_usa/nuances.json', evidence: 'export/antelope_canyon_usa/evidence.json' }
    },
    { 
      id: 'athens_greece', 
      name: 'Athens Greece', 
      flag: '🌍',
      dataFiles: { themes: 'export/athens_greece/themes.json', nuances: 'export/athens_greece/nuances.json', evidence: 'export/athens_greece/evidence.json' }
    },
    { 
      id: 'bagan_myanmar', 
      name: 'Bagan Myanmar', 
      flag: '🌍',
      dataFiles: { themes: 'export/bagan_myanmar/themes.json', nuances: 'export/bagan_myanmar/nuances.json', evidence: 'export/bagan_myanmar/evidence.json' }
    },
    { 
      id: 'banff_national_park_canada', 
      name: 'Banff National Park Canada', 
      flag: '🌍',
      dataFiles: { themes: 'export/banff_national_park_canada/themes.json', nuances: 'export/banff_national_park_canada/nuances.json', evidence: 'export/banff_national_park_canada/evidence.json' }
    },
    { 
      id: 'bangkok_thailand', 
      name: 'Bangkok Thailand', 
      flag: '🌍',
      dataFiles: { themes: 'export/bangkok_thailand/themes.json', nuances: 'export/bangkok_thailand/nuances.json', evidence: 'export/bangkok_thailand/evidence.json' }
    },
    { 
      id: 'bend_oregon', 
      name: 'Bend Oregon', 
      flag: '🌍',
      dataFiles: { themes: 'export/bend_oregon/themes.json', nuances: 'export/bend_oregon/nuances.json', evidence: 'export/bend_oregon/evidence.json' }
    },
    { 
      id: 'black_forest_germany', 
      name: 'Black Forest Germany', 
      flag: '🌍',
      dataFiles: { themes: 'export/black_forest_germany/themes.json', nuances: 'export/black_forest_germany/nuances.json', evidence: 'export/black_forest_germany/evidence.json' }
    },
    { 
      id: 'bora_bora_french_polynesia', 
      name: 'Bora Bora French Polynesia', 
      flag: '🌍',
      dataFiles: { themes: 'export/bora_bora_french_polynesia/themes.json', nuances: 'export/bora_bora_french_polynesia/nuances.json', evidence: 'export/bora_bora_french_polynesia/evidence.json' }
    },
    { 
      id: 'bryce_canyon_usa', 
      name: 'Bryce Canyon Usa', 
      flag: '🌍',
      dataFiles: { themes: 'export/bryce_canyon_usa/themes.json', nuances: 'export/bryce_canyon_usa/nuances.json', evidence: 'export/bryce_canyon_usa/evidence.json' }
    },
    { 
      id: 'cape_town_south_africa', 
      name: 'Cape Town South Africa', 
      flag: '🌍',
      dataFiles: { themes: 'export/cape_town_south_africa/themes.json', nuances: 'export/cape_town_south_africa/nuances.json', evidence: 'export/cape_town_south_africa/evidence.json' }
    },
    { 
      id: 'chichén_itzá_mexico', 
      name: 'Chichén Itzá Mexico', 
      flag: '🌍',
      dataFiles: { themes: 'export/chichén_itzá_mexico/themes.json', nuances: 'export/chichén_itzá_mexico/nuances.json', evidence: 'export/chichén_itzá_mexico/evidence.json' }
    },
    { 
      id: 'choa_chu_kang_cemetery_singapore', 
      name: 'Choa Chu Kang Cemetery Singapore', 
      flag: '🌍',
      dataFiles: { themes: 'export/choa_chu_kang_cemetery_singapore/themes.json', nuances: 'export/choa_chu_kang_cemetery_singapore/nuances.json', evidence: 'export/choa_chu_kang_cemetery_singapore/evidence.json' }
    },
    { 
      id: 'colosseum_italy', 
      name: 'Colosseum Italy', 
      flag: '🌍',
      dataFiles: { themes: 'export/colosseum_italy/themes.json', nuances: 'export/colosseum_italy/nuances.json', evidence: 'export/colosseum_italy/evidence.json' }
    },
    { 
      id: 'crater_lake_national_park_oregon', 
      name: 'Crater Lake National Park Oregon', 
      flag: '🌍',
      dataFiles: { themes: 'export/crater_lake_national_park_oregon/themes.json', nuances: 'export/crater_lake_national_park_oregon/nuances.json', evidence: 'export/crater_lake_national_park_oregon/evidence.json' }
    },
    { 
      id: 'dargavs_north_ossetia', 
      name: 'Dargavs North Ossetia', 
      flag: '🌍',
      dataFiles: { themes: 'export/dargavs_north_ossetia/themes.json', nuances: 'export/dargavs_north_ossetia/nuances.json', evidence: 'export/dargavs_north_ossetia/evidence.json' }
    },
    { 
      id: 'dead_sea_israel', 
      name: 'Dead Sea Israel', 
      flag: '🌍',
      dataFiles: { themes: 'export/dead_sea_israel/themes.json', nuances: 'export/dead_sea_israel/nuances.json', evidence: 'export/dead_sea_israel/evidence.json' }
    },
    { 
      id: 'dubai_uae', 
      name: 'Dubai Uae', 
      flag: '🌍',
      dataFiles: { themes: 'export/dubai_uae/themes.json', nuances: 'export/dubai_uae/nuances.json', evidence: 'export/dubai_uae/evidence.json' }
    },
    { 
      id: 'edinburgh_scotland', 
      name: 'Edinburgh Scotland', 
      flag: '🌍',
      dataFiles: { themes: 'export/edinburgh_scotland/themes.json', nuances: 'export/edinburgh_scotland/nuances.json', evidence: 'export/edinburgh_scotland/evidence.json' }
    },
    { 
      id: 'florence_italy', 
      name: 'Florence Italy', 
      flag: '🌍',
      dataFiles: { themes: 'export/florence_italy/themes.json', nuances: 'export/florence_italy/nuances.json', evidence: 'export/florence_italy/evidence.json' }
    },
    { 
      id: 'fort_canning_park_singapore', 
      name: 'Fort Canning Park Singapore', 
      flag: '🌍',
      dataFiles: { themes: 'export/fort_canning_park_singapore/themes.json', nuances: 'export/fort_canning_park_singapore/nuances.json', evidence: 'export/fort_canning_park_singapore/evidence.json' }
    },
    { 
      id: 'galápagos_islands_ecuador', 
      name: 'Galápagos Islands Ecuador', 
      flag: '🌍',
      dataFiles: { themes: 'export/galápagos_islands_ecuador/themes.json', nuances: 'export/galápagos_islands_ecuador/nuances.json', evidence: 'export/galápagos_islands_ecuador/evidence.json' }
    },
    { 
      id: 'gardens_by_the_bay_singapore', 
      name: 'Gardens By The Bay Singapore', 
      flag: '🌍',
      dataFiles: { themes: 'export/gardens_by_the_bay_singapore/themes.json', nuances: 'export/gardens_by_the_bay_singapore/nuances.json', evidence: 'export/gardens_by_the_bay_singapore/evidence.json' }
    },
    { 
      id: 'gates_of_the_arctic_national_park_and_preserve_alaska', 
      name: 'Gates Of The Arctic National Park And Preserve Alaska', 
      flag: '🌍',
      dataFiles: { themes: 'export/gates_of_the_arctic_national_park_and_preserve_alaska/themes.json', nuances: 'export/gates_of_the_arctic_national_park_and_preserve_alaska/nuances.json', evidence: 'export/gates_of_the_arctic_national_park_and_preserve_alaska/evidence.json' }
    },
    { 
      id: 'ghana_africa', 
      name: 'Ghana Africa', 
      flag: '🌍',
      dataFiles: { themes: 'export/ghana_africa/themes.json', nuances: 'export/ghana_africa/nuances.json', evidence: 'export/ghana_africa/evidence.json' }
    },
    { 
      id: 'giants_causeway_uk', 
      name: 'Giant\'s Causeway Uk', 
      flag: '🌍',
      dataFiles: { themes: 'export/giants_causeway_uk/themes.json', nuances: 'export/giants_causeway_uk/nuances.json', evidence: 'export/giants_causeway_uk/evidence.json' }
    },
    { 
      id: 'golden_circle_iceland', 
      name: 'Golden Circle Iceland', 
      flag: '🌍',
      dataFiles: { themes: 'export/golden_circle_iceland/themes.json', nuances: 'export/golden_circle_iceland/nuances.json', evidence: 'export/golden_circle_iceland/evidence.json' }
    },
    { 
      id: 'grand_canyon_usa', 
      name: 'Grand Canyon Usa', 
      flag: '🌍',
      dataFiles: { themes: 'export/grand_canyon_usa/themes.json', nuances: 'export/grand_canyon_usa/nuances.json', evidence: 'export/grand_canyon_usa/evidence.json' }
    },
    { 
      id: 'great_barrier_reef_australia', 
      name: 'Great Barrier Reef Australia', 
      flag: '🌍',
      dataFiles: { themes: 'export/great_barrier_reef_australia/themes.json', nuances: 'export/great_barrier_reef_australia/nuances.json', evidence: 'export/great_barrier_reef_australia/evidence.json' }
    },
    { 
      id: 'ha_long_bay_vietnam', 
      name: 'Ha Long Bay Vietnam', 
      flag: '🌍',
      dataFiles: { themes: 'export/ha_long_bay_vietnam/themes.json', nuances: 'export/ha_long_bay_vietnam/nuances.json', evidence: 'export/ha_long_bay_vietnam/evidence.json' }
    },
    { 
      id: 'hanoi_vietnam', 
      name: 'Hanoi Vietnam', 
      flag: '🌍',
      dataFiles: { themes: 'export/hanoi_vietnam/themes.json', nuances: 'export/hanoi_vietnam/nuances.json', evidence: 'export/hanoi_vietnam/evidence.json' }
    },
    { 
      id: 'havana_cuba', 
      name: 'Havana Cuba', 
      flag: '🌍',
      dataFiles: { themes: 'export/havana_cuba/themes.json', nuances: 'export/havana_cuba/nuances.json', evidence: 'export/havana_cuba/evidence.json' }
    },
    { 
      id: 'haw_par_villa_singapore', 
      name: 'Haw Par Villa Singapore', 
      flag: '🌍',
      dataFiles: { themes: 'export/haw_par_villa_singapore/themes.json', nuances: 'export/haw_par_villa_singapore/nuances.json', evidence: 'export/haw_par_villa_singapore/evidence.json' }
    },
    { 
      id: 'iguazu_falls_brazil', 
      name: 'Iguazu Falls Brazil', 
      flag: '🌍',
      dataFiles: { themes: 'export/iguazu_falls_brazil/themes.json', nuances: 'export/iguazu_falls_brazil/nuances.json', evidence: 'export/iguazu_falls_brazil/evidence.json' }
    },
    { 
      id: 'istanbul_turkey', 
      name: 'Istanbul Turkey', 
      flag: '🌍',
      dataFiles: { themes: 'export/istanbul_turkey/themes.json', nuances: 'export/istanbul_turkey/nuances.json', evidence: 'export/istanbul_turkey/evidence.json' }
    },
    { 
      id: 'jeita_grotto_lebanon', 
      name: 'Jeita Grotto Lebanon', 
      flag: '🌍',
      dataFiles: { themes: 'export/jeita_grotto_lebanon/themes.json', nuances: 'export/jeita_grotto_lebanon/nuances.json', evidence: 'export/jeita_grotto_lebanon/evidence.json' }
    },
    { 
      id: 'jerusalem_israel', 
      name: 'Jerusalem Israel', 
      flag: '🌍',
      dataFiles: { themes: 'export/jerusalem_israel/themes.json', nuances: 'export/jerusalem_israel/nuances.json', evidence: 'export/jerusalem_israel/evidence.json' }
    },
    { 
      id: 'jos_nigeria', 
      name: 'Jos Nigeria', 
      flag: '🌍',
      dataFiles: { themes: 'export/jos_nigeria/themes.json', nuances: 'export/jos_nigeria/nuances.json', evidence: 'export/jos_nigeria/evidence.json' }
    },
    { 
      id: 'kamchatka_peninsula_russia', 
      name: 'Kamchatka Peninsula Russia', 
      flag: '🌍',
      dataFiles: { themes: 'export/kamchatka_peninsula_russia/themes.json', nuances: 'export/kamchatka_peninsula_russia/nuances.json', evidence: 'export/kamchatka_peninsula_russia/evidence.json' }
    },
    { 
      id: 'kizhi_island_russia', 
      name: 'Kizhi Island Russia', 
      flag: '🌍',
      dataFiles: { themes: 'export/kizhi_island_russia/themes.json', nuances: 'export/kizhi_island_russia/nuances.json', evidence: 'export/kizhi_island_russia/evidence.json' }
    },
    { 
      id: 'kyoto_japan', 
      name: 'Kyoto Japan', 
      flag: '🌍',
      dataFiles: { themes: 'export/kyoto_japan/themes.json', nuances: 'export/kyoto_japan/nuances.json', evidence: 'export/kyoto_japan/evidence.json' }
    },
    { 
      id: 'lake_baikal_russia', 
      name: 'Lake Baikal Russia', 
      flag: '🌍',
      dataFiles: { themes: 'export/lake_baikal_russia/themes.json', nuances: 'export/lake_baikal_russia/nuances.json', evidence: 'export/lake_baikal_russia/evidence.json' }
    },
    { 
      id: 'lena_pillars_russia', 
      name: 'Lena Pillars Russia', 
      flag: '🌍',
      dataFiles: { themes: 'export/lena_pillars_russia/themes.json', nuances: 'export/lena_pillars_russia/nuances.json', evidence: 'export/lena_pillars_russia/evidence.json' }
    },
    { 
      id: 'littleton_colorado', 
      name: 'Littleton Colorado', 
      flag: '🌍',
      dataFiles: { themes: 'export/littleton_colorado/themes.json', nuances: 'export/littleton_colorado/nuances.json', evidence: 'export/littleton_colorado/evidence.json' }
    },
    { 
      id: 'machu_picchu_peru', 
      name: 'Machu Picchu Peru', 
      flag: '🌍',
      dataFiles: { themes: 'export/machu_picchu_peru/themes.json', nuances: 'export/machu_picchu_peru/nuances.json', evidence: 'export/machu_picchu_peru/evidence.json' }
    },
    { 
      id: 'maldives', 
      name: 'Maldives', 
      flag: '🌍',
      dataFiles: { themes: 'export/maldives/themes.json', nuances: 'export/maldives/nuances.json', evidence: 'export/maldives/evidence.json' }
    },
    { 
      id: 'marrakech_morocco', 
      name: 'Marrakech Morocco', 
      flag: '🌍',
      dataFiles: { themes: 'export/marrakech_morocco/themes.json', nuances: 'export/marrakech_morocco/nuances.json', evidence: 'export/marrakech_morocco/evidence.json' }
    },
    { 
      id: 'mount_kilimanjaro_tanzania', 
      name: 'Mount Kilimanjaro Tanzania', 
      flag: '🌍',
      dataFiles: { themes: 'export/mount_kilimanjaro_tanzania/themes.json', nuances: 'export/mount_kilimanjaro_tanzania/nuances.json', evidence: 'export/mount_kilimanjaro_tanzania/evidence.json' }
    },
    { 
      id: 'new_york_city_usa', 
      name: 'New York City Usa', 
      flag: '🌍',
      dataFiles: { themes: 'export/new_york_city_usa/themes.json', nuances: 'export/new_york_city_usa/nuances.json', evidence: 'export/new_york_city_usa/evidence.json' }
    },
    { 
      id: 'niagara_falls_usa', 
      name: 'Niagara Falls Usa', 
      flag: '🌍',
      dataFiles: { themes: 'export/niagara_falls_usa/themes.json', nuances: 'export/niagara_falls_usa/nuances.json', evidence: 'export/niagara_falls_usa/evidence.json' }
    },
    { 
      id: 'oxford_uk', 
      name: 'Oxford Uk', 
      flag: '🌍',
      dataFiles: { themes: 'export/oxford_uk/themes.json', nuances: 'export/oxford_uk/nuances.json', evidence: 'export/oxford_uk/evidence.json' }
    },
    { 
      id: 'paris_france', 
      name: 'Paris France', 
      flag: '🇫🇷',
      dataFiles: { themes: 'export/paris_france/themes.json', nuances: 'export/paris_france/nuances.json', evidence: 'export/paris_france/evidence.json' }
    },
    { 
      id: 'prague_czech_republic', 
      name: 'Prague Czech Republic', 
      flag: '🌍',
      dataFiles: { themes: 'export/prague_czech_republic/themes.json', nuances: 'export/prague_czech_republic/nuances.json', evidence: 'export/prague_czech_republic/evidence.json' }
    },
    { 
      id: 'reykjavik_iceland', 
      name: 'Reykjavik Iceland', 
      flag: '🌍',
      dataFiles: { themes: 'export/reykjavik_iceland/themes.json', nuances: 'export/reykjavik_iceland/nuances.json', evidence: 'export/reykjavik_iceland/evidence.json' }
    },
    { 
      id: 'reynisdrangar_basalt_columns_iceland', 
      name: 'Reynisdrangar Basalt Columns Iceland', 
      flag: '🌍',
      dataFiles: { themes: 'export/reynisdrangar_basalt_columns_iceland/themes.json', nuances: 'export/reynisdrangar_basalt_columns_iceland/nuances.json', evidence: 'export/reynisdrangar_basalt_columns_iceland/evidence.json' }
    },
    { 
      id: 'rome_italy', 
      name: 'Rome Italy', 
      flag: '🇮🇹',
      dataFiles: { themes: 'export/rome_italy/themes.json', nuances: 'export/rome_italy/nuances.json', evidence: 'export/rome_italy/evidence.json' }
    },
    { 
      id: 'santorini_greece', 
      name: 'Santorini Greece', 
      flag: '🌍',
      dataFiles: { themes: 'export/santorini_greece/themes.json', nuances: 'export/santorini_greece/nuances.json', evidence: 'export/santorini_greece/evidence.json' }
    },
    { 
      id: 'scottish_highlands_scotland', 
      name: 'Scottish Highlands Scotland', 
      flag: '🌍',
      dataFiles: { themes: 'export/scottish_highlands_scotland/themes.json', nuances: 'export/scottish_highlands_scotland/nuances.json', evidence: 'export/scottish_highlands_scotland/evidence.json' }
    },
    { 
      id: 'seattle_washington', 
      name: 'Seattle Washington', 
      flag: '🌍',
      dataFiles: { themes: 'export/seattle_washington/themes.json', nuances: 'export/seattle_washington/nuances.json', evidence: 'export/seattle_washington/evidence.json' }
    },
    { 
      id: 'serengeti_national_park_tanzania', 
      name: 'Serengeti National Park Tanzania', 
      flag: '🌍',
      dataFiles: { themes: 'export/serengeti_national_park_tanzania/themes.json', nuances: 'export/serengeti_national_park_tanzania/nuances.json', evidence: 'export/serengeti_national_park_tanzania/evidence.json' }
    },
    { 
      id: 'siem_reap_cambodia', 
      name: 'Siem Reap Cambodia', 
      flag: '🌍',
      dataFiles: { themes: 'export/siem_reap_cambodia/themes.json', nuances: 'export/siem_reap_cambodia/nuances.json', evidence: 'export/siem_reap_cambodia/evidence.json' }
    },
    { 
      id: 'sydney_australia', 
      name: 'Sydney Australia', 
      flag: '🌍',
      dataFiles: { themes: 'export/sydney_australia/themes.json', nuances: 'export/sydney_australia/nuances.json', evidence: 'export/sydney_australia/evidence.json' }
    },
    { 
      id: 'tokyo_japan', 
      name: 'Tokyo Japan', 
      flag: '🇯🇵',
      dataFiles: { themes: 'export/tokyo_japan/themes.json', nuances: 'export/tokyo_japan/nuances.json', evidence: 'export/tokyo_japan/evidence.json' }
    },
    { 
      id: 'uluru_australia', 
      name: 'Uluru Australia', 
      flag: '🌍',
      dataFiles: { themes: 'export/uluru_australia/themes.json', nuances: 'export/uluru_australia/nuances.json', evidence: 'export/uluru_australia/evidence.json' }
    },
    { 
      id: 'venice_italy', 
      name: 'Venice Italy', 
      flag: '🌍',
      dataFiles: { themes: 'export/venice_italy/themes.json', nuances: 'export/venice_italy/nuances.json', evidence: 'export/venice_italy/evidence.json' }
    },
    { 
      id: 'victoria_falls_zimbabwe', 
      name: 'Victoria Falls Zimbabwe', 
      flag: '🌍',
      dataFiles: { themes: 'export/victoria_falls_zimbabwe/themes.json', nuances: 'export/victoria_falls_zimbabwe/nuances.json', evidence: 'export/victoria_falls_zimbabwe/evidence.json' }
    },
    { 
      id: 'yosemite_national_park_usa', 
      name: 'Yosemite National Park Usa', 
      flag: '🌍',
      dataFiles: { themes: 'export/yosemite_national_park_usa/themes.json', nuances: 'export/yosemite_national_park_usa/nuances.json', evidence: 'export/yosemite_national_park_usa/evidence.json' }
    }
  ],
  
  // Default destination (must be one of the available destinations)
  DEFAULT_DESTINATION: 'paris_france',
  
  // Data directory path (relative to public/)
  DATA_PATH: '/data/',
  
  // Cache settings
  CACHE_TIMEOUT: 5 * 60 * 1000, // 5 minutes
  
  // Validation settings
  VALIDATE_DATA_ON_LOAD: false, // Disabled to prevent errors for missing data files
  
  // Export data configuration
  EXPORT_DATA_CONFIG: {
    BASE_PATH: '/data/export/',
    SCHEMA_VERSION: '2024.1'
  }
};

// Application Configuration
const APP_CONFIG = {
  API: API_CONFIG,
  DESTINATIONS: DESTINATION_CONFIG
};

export { API_CONFIG, DESTINATION_CONFIG };
export default APP_CONFIG; 