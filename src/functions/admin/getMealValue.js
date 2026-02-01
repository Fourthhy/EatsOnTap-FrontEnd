const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

export async function getMealValue() {
    // ⚠️ CHECK ROUTE: Matches /api/mealvalue/getMealValue
    const targetUrl = `${VITE_BASE_URL}/api/mealvalue/getMealValue`;

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch meal value: ${response.status}`);
        }

        const data = await response.json();
        console.log('MEAL VALUE RECEIVED', data.mealValue)
        
        // Return just the number value for easier use in components
        return data.mealValue; 

    } catch (error) {
        console.error("Error fetching meal value:", error);
        return 0; // Return safe default on error
    }
}