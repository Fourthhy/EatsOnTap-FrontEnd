const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getAllSettings() {
    const targetUrl = `${VITE_BASE_URL}/api/setting/fetchAllSettings`;

    console.log("⚙️ Fetching System Settings...", targetUrl);

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // credentials: 'include' // Uncomment if route is protected by Auth
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch settings: ${response.status}`);
        }

        const data = await response.json();
        
        // Log for debugging
        console.log("✅ Settings Received:", data);
        
        return data; // Returns the array of settings directly

    } catch (error) {
        console.error("Error fetching settings:", error);
        return []; // Return empty array on failure so .map() doesn't crash UI
    }
}