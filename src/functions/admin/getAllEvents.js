const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

export async function getAllEvents() {
    const targetUrl = `${VITE_BASE_URL}/api/fetch/getAllEvents`;
    console.log("🌐 Fetching Meal Request for Events from:", targetUrl);

    try {
        const response = await fetch(targetUrl);

        if (!response.ok) {
            throw new Error(`Failed to Meal Request for Events: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("📦 Meal Requests for Events:", data);
        return data;
    } catch (error) {
        console.error('Error Meal Request for Events:', error);
        return [];
    }

}