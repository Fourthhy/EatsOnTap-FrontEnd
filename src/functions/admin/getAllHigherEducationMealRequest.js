const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

export async function getAllHigherEducationMealRequest() {
    const targetUrl = `${VITE_BASE_URL}/api/fetch/getAllHigherEducationMealRequest`;
    try {
        const response = await fetch(targetUrl);

        if (!response.ok) {
            throw new Error(`Failed to Fetch Meal Request for Higher Education: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error Fetching Meal Request for Higher Education Received:', error);
        return [];
    }

}