const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Fetches the dishes for a specific date.
 * @param {string|Date} date - The date to query (e.g., "2026-02-03" or a Date object).
 */
export const viewDishes = async (date) => {
    try {
        // 1. Format date parameter safely
        const dateParam = date instanceof Date 
            ? date.toISOString() 
            : date;
        
        // 2. Construct Query String
        const queryParams = new URLSearchParams({ date: dateParam }).toString();

        // 3. Make GET Request
        const response = await fetch(`${VITE_BASE_URL}/api/report/viewDishes?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Important for cookie/session consistency
        });

        const data = await response.json();

        // 4. Handle Errors (including 404 Not Found)
        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch dishes");
        }

        return data;
    } catch (error) {
        console.error("Error fetching dishes:", error);
        throw error;
    }
};