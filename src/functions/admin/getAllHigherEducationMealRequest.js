const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

export async function getAllHigherEducationMealRequest() {
    const targetUrl = `${VITE_BASE_URL}/api/fetch/getAllHigherEducationMealRequest`;
    console.log("🌐 Fetching Meal Request for Higher Education from:", targetUrl);

    try {
        const response = await fetch(targetUrl);

        if (!response.ok) {
            throw new Error(`Failed to Fetch Meal Request for Higher Education: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("📦 Meal Request for Higher Education Received:", data);
        return data;
    } catch (error) {
        console.error('Error Fetching Meal Request for Higher Education Received:', error);
        return [];
    }

}