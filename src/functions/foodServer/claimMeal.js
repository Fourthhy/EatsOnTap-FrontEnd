const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const BASE_URL = VITE_LOCALHOST;

export async function claimMeal(studentInput) {
    // ⚠️ CHECK ROUTE: Matches /api/claim/claim-meal
    const targetUrl = `${BASE_URL}/api/claim/claim-meal`;
    try {
        const response = await fetch(targetUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentInput }),
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || `Claim failed: ${response.status}`);
        }
        return result;

    } catch (error) {
        console.error("Error processing claim:", error);
        throw error; // Re-throw to display specific message in UI
    }
}