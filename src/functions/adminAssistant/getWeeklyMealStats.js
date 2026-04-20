const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

const BASE_URL = VITE_BASE_URL; // Ensure this is the one you intend to use for your requests

// 🟢 Function to fetch Weekly Meal Statistics
export async function getWeeklyMealStats() {
    
    // ⚠️ CHECK ROUTE: Ensure '/api/statistics/weekly-stats' matches your backend routes
    // Example: router.get('/weekly-stats', getWeeklyMealStats)
    const targetUrl = `${BASE_URL}/api/programSchedule/getWeeklyMealStats`;
    
    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch weekly meal stats: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error Fetching Weekly Meal Stats:', error);
        
        // Return a safe fallback structure matching your expected JSON response 
        // to prevent frontend multidimensional array mapping from crashing
        return { 
            success: false, 
            data: [] 
        };
    }
}