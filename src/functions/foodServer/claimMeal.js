const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export async function claimMeal(studentInput) {
    // 🟢 CHANGE 1: Append data to URL as a query parameter
    // We use encodeURIComponent to ensure special characters (like spaces) don't break the URL
    const targetUrl = `${VITE_BASE_URL}/api/claim/fakeMealClaim?studentInput=${encodeURIComponent(studentInput)}`;
    
    console.log("🌐 Fetching Student Data from:", targetUrl);

    try {
        const response = await fetch(targetUrl, {
            method: 'GET', // 🟢 CHANGE 2: Method is GET
            headers: {
                'Content-Type': 'application/json',
            },
            // 🟢 CHANGE 3: Remove 'body' entirely. GET requests cannot have a body.
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Failed to fetch: ${response.status}`);
        }

        console.log("Student Found!", data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}