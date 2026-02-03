const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

export async function getAllBasicEducationMealRequest() {
    const targetUrl = `${VITE_BASE_URL}/api/fetch/getAllBasicEducationMealRequest`;
    try {
        const response = await fetch(targetUrl);

        if (!response.ok) {
            throw new Error(`Failed to Fetch Meal Request for Basic Education: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error Fetching Meal Request for Basic Education:', error);
        return [];
    }

}