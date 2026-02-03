const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
export async function claimFoodItem(studentID, creditTaken) {
    const targetUrl = `${VITE_BASE_URL}/api/claim/${encodeURIComponent(studentID)}/claim-foodItem`;

    try {
        const response = await fetch(targetUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ creditTaken }),
            credentials: 'include' // Important for cookies/sessions if used
        });

        const data = await response.json();

        if (!response.ok) {
            // Throw an error with the message from the backend (e.g., "Insufficient balance")
            throw new Error(data.message || `Error: ${response.status}`);
        }

        return data; // Returns the updated balance and payment breakdown
    } catch (error) {
        console.error("❌ Error claiming food item:", error);
        throw error; // Re-throw so the UI (FoodItemClaim.jsx) can catch and alert
    }
}