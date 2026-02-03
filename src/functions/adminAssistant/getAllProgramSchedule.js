const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

// 🟢 Function to fetch ALL Program Schedules
export async function getAllProgramSchedule() {
    
    // ⚠️ CHECK ROUTE: Ensure '/api/schedule' matches your server.js mount point
    // Example: router.get('/fetchAllProgramSchedule', ...)
    const targetUrl = `${VITE_BASE_URL}/api/programschedule/fetchAllProgramSchedule`;
    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch schedules: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error Fetching Schedules:', error);
        return []; // Return empty array to prevent UI crashes
    }
}