const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getDashboardData(date = null) {
    // 1. Construct URL with optional Query Parameter
    // Assuming your router is mounted at /api/reports
    let targetUrl = `${VITE_BASE_URL}/api/fetch/getDashboardData`;

    // If a specific date is provided, append it to the URL
    // Format: ?date=2026-02-03
    if (date) {
        const dateString = new Date(date).toISOString(); // Ensure valid ISO string
        targetUrl += `?date=${dateString}`;
    }
    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // 🟢 CRITICAL: Include cookies so the backend knows who the Admin is
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Dashboard fetch failed: ${response.status}`);
        }

        const data = await response.json();
        return data; // Returns the { today, weekly, monthly, overall } object

    } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
        return null; // Return null so the UI can show a specific error state or retry
    }
}
