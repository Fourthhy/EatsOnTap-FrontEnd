export const APP_INITIALIZATION_MANIFEST = {
    critical: [
        { 
            id: 'dash_chart_daily', 
            label: 'Loading Dashboard Analytics...', 
            weight: 20 
        },
        { 
            id: 'fetch_unified_data', 
            label: 'Optimizing School Records...', 
            weight: 70 
        },
        {
            id: 'fetch_class_advisers',
            label: 'Getting Class Advisers',
            weight: 10
        }
    ],
    secondary: [
        { id: 'sync_events', label: 'Syncing Calendar Events...', weight: 10 },
        { id: 'check_system_health', label: 'Finalizing System Check...', weight: 5 }
    ]
};