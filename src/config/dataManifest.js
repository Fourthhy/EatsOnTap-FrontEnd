export const APP_INITIALIZATION_MANIFEST = {
    // BATCH 1: CRITICAL (Runs first, required for Dashboard)
    // Total Weight: 40%
    critical: [
        { 
            id: 'auth_check', 
            label: 'Verifying Admin Credentials...', 
            weight: 10 
        },
        { 
            id: 'dash_daily', 
            label: 'Aggregating Daily Meal Stats (Last 6 Days)...', 
            weight: 15 
        },
        { 
            id: 'dash_weekly', 
            label: 'Computing Weekly Trends (Last 4 Weeks)...', 
            weight: 15 
        }
    ],

    // BATCH 2: HEAVY LISTS (Runs in background after critical is done)
    // Total Weight: 60%
    secondary: [
        { 
            id: 'master_students', 
            label: 'Loading Student Registry...', 
            weight: 30 
        },
        { 
            id: 'master_events', 
            label: 'Syncing Event Calendar...', 
            weight: 20 
        },
        { 
            id: 'sys_menu', 
            label: 'Checking Menu Availability...', 
            weight: 10 
        }
    ]
};