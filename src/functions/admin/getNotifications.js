const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const BASE_URL = VITE_BASE_URL;

/**
 * Fetches notifications based on user role and ID
 * @param {string} role - The role of the user (e.g., 'admin', 'adviser')
 * @param {string} userID - The ID of the current user to check 'isRead' status
 */
export async function getNotifications(role, userID) {
    // ⚠️ IMPORTANT: No query parameters needed for a POST request.
    const targetUrl = `${BASE_URL}/api/fetch/fetchNotifications`;

    try {
        const response = await fetch(targetUrl, {
            method: 'POST', // Changed to POST
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            // Send the data inside the body as a JSON string
            body: JSON.stringify({ role, userID }), 
        });

        // 🟢 DEBUGGING: Read text first to catch HTML errors (e.g., 404s)
        const responseText = await response.text();

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (jsonError) {
            console.error("❌ CRITICAL ERROR: Server returned HTML instead of JSON.");
            console.error("Response Body:", responseText);
            throw new Error(`Server returned invalid format (HTML). Check your API URL: ${targetUrl}`);
        }

        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch notifications');
        }

        return result;
    } catch (error) {
        console.error("Error in getNotifications API helper:", error);
        throw error;
    }
}