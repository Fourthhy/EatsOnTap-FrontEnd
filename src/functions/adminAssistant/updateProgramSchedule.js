const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

const BASE_URL = VITE_BASE_URL; // Ensure this is the one you intend to use for your requests

// 🟢 Function to update a Program Schedule
export async function updateProgramSchedule(scheduleData) {
    
    // ⚠️ CHECK ROUTE: Ensure '/api/programSchedule/updateProgramSchedule' matches your backend routes
    // Example: router.put('/updateProgramSchedule', updateProgramSchedule)
    const targetUrl = `${BASE_URL}/api/programSchedule/updateProgramSchedule`;
    
    try {
        const response = await fetch(targetUrl, {
            method: 'PUT', // Using PUT since this is an update operation
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(scheduleData) // Stringify the payload from the EditScheduleModal
        });

        if (!response.ok) {
            // Attempt to extract the custom error message sent by the controller (e.g., duplicate schedule)
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || `${response.status} ${response.statusText}`;
            throw new Error(`Failed to update schedule: ${errorMessage}`);
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error Updating Program Schedule:', error);
        
        // Return a safe fallback structure matching your expected JSON response 
        // to prevent frontend state from crashing and allow UI error handling
        return { 
            success: false, 
            message: error.message || "An unexpected error occurred while saving.",
            data: null 
        };
    }
}