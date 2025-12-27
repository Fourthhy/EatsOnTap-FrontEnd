export const APP_INITIALIZATION_MANIFEST = {
    // BATCH 1: CRITICAL (Runs first, required for Dashboard)
    // Total Weight: 40%
    critical: [
        {
            id: 'dash_chart_daily',
            label: 'Fetching Daily Data for all charts (Last 6 days)...',
            weight: 10
        },
        {
            id: 'dash_chart_weekly',
            label: 'Fetching Weekly Data for all charts (Last 4 weeks)...',
            weight: 10
        },
        {
            id: 'dash_chart_monthly',
            label: 'Fetching Monthly Data for all charts (Last 4 months)...',
            weight: 10
        },
        {
            id: 'dash_chart_overall',
            label: 'Fetching Overall Data for all charts...',
            weight: 10
        },
    ],

    // BATCH 2: HEAVY LISTS (Runs in background after critical is done)
    // Total Weight: 60%
    secondary: [
        {
            id: 'master_students',
            label: 'Loading Student Registry...',
            weight: 15
        },
        {
            id: 'master_events',
            label: 'Syncing Event Calendar...',
            weight: 15
        },
        {
            id: 'master_orders',
            label: 'Loading Order Records...',
            weight: 15
        },
        {
            id: 'master_claim records',
            label: 'Loading Claim Records',
            weight: 10
        },
        {
            id: 'master_claim records',
            label: 'Opening...',
            weight: 5
        },
    ]
};