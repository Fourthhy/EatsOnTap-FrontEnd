const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL = VITE_LOCALHOST; 

/**
 * Marks an array of notifications as read for a specific user.
 * @param {string[]} notificationIds - Array of notification IDs to update
 * @param {string} userID - The ID of the current user 
 */
export async function markNotificationsAsRead(notificationIds, userID) {
    // ⚠️ IMPORTANT: Route updated to match the users controller
    const targetUrl = `${BASE_URL}/api/users/markAsRead`;

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            // Send the array of IDs and the user ID inside the body
            body: JSON.stringify({ notificationIds, userID }), 
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
            throw new Error(result.message || 'Failed to mark notifications as read');
        }

        return result;
    } catch (error) {
        console.error("Error in markNotificationsAsRead API helper:", error);
        throw error;
    }
}