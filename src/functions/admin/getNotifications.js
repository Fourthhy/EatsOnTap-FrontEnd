const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

const BASE_URL = VITE_BASE_URL;

/**
 * Fetches notifications based on user role and ID
 * @param {string} role - The role of the user (e.g., 'admin', 'adviser')
 * @param {string} userID - The ID of the current user to check 'isRead' status
 */
export async function getNotifications(role, userID) {
    try {
        // Construct the URL with query parameters
        const url = new URL(`${BASE_URL}/api/fetch/fetchNotifications`);
        
        if (role) url.searchParams.append('role', role);
        if (userID) url.searchParams.append('userID', userID);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // If you use JWT tokens, add the Authorization header here:
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch notifications');
        }

        return await response.json();
    } catch (error) {
        console.error("Error in getNotifications API helper:", error);
        throw error;
    }
}