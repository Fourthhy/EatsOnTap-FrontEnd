const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Adds dishes to the daily report menu.
 * * @param {Object} dishData - The payload object.
 * @param {string[]} dishData.dishes - Array of strings (e.g. ["Adobo", "Rice"]).
 * @param {string|Date} [dishData.date] - Optional date string.
 */
export const addDishes = async (dishData) => {
    try {
        // Construct URL: /api/report + /addDishes
        const response = await fetch(`${VITE_BASE_URL}/api/report/addDishes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add Authorization header here if you are using JWT cookies or tokens
                // 'Authorization': `Bearer ${token}` 
            },
            // Start credentials: 'include' if you rely on cookies (req.user) for the 'actorID'
            credentials: 'include', 
            body: JSON.stringify(dishData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update menu");
        }

        return data;
    } catch (error) {
        console.error("Error adding dishes:", error);
        throw error;
    }
};