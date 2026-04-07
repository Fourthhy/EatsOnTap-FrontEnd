const VITE_BASE_URL = import.meta.env.VITE_LOCALHOST; 
// const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Fetches the dishes for a specific date.
 * @param {string|Date} date - The date to query
 */
export const viewDishes = async (date) => {
    try {
        // 🟢 FIX 1: Format date safely as local "YYYY-MM-DD" instead of UTC ISO String
        // This prevents the strict .getTime() check on the backend from failing due to an 8-hour shift!
        let dateParam;
        if (date instanceof Date) {
            // Extracts local YYYY-MM-DD
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            dateParam = `${year}-${month}-${day}`;
        } else {
            dateParam = date;
        }
        
        // Construct Query String
        const queryParams = new URLSearchParams({ date: dateParam }).toString();

        // Make GET Request
        const response = await fetch(`${VITE_BASE_URL}/api/report/viewDishes?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        });

        const data = await response.json();

        // Handle Errors 
        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch dishes");
        }

        // 🟢 FIX 2: Return only the array of dishes so your React components don't crash
        // Fallback to an empty array just in case it's undefined
        return data.dishes || []; 
        
    } catch (error) {
        console.error("Error fetching dishes:", error);
        throw error;
    }
};