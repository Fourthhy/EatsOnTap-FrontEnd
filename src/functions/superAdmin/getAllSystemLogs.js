const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
export async function getAllSystemLogs(params = {}) {
    try {
        // 1. Construct the URL safely
        const targetUrl = new URL(`${VITE_BASE_URL}/api/systemlogger/getAllSystemLogs`);

        // 2. Append parameters dynamically
        // This loop ensures only valid values are added to the URL
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                targetUrl.searchParams.append(key, params[key]);
            }
        });

        console.log("📜 Fetching System Logs from:", targetUrl.toString());

        const response = await fetch(targetUrl.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // If your log route is protected by the auth cookie, uncomment this:
            // credentials: 'include' 
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to fetch logs: ${response.status}`);
        }

        const data = await response.json();
        return data; // Returns { success, count, total, data: [...] }

    } catch (error) {
        console.error('Error Fetching System Logs:', error);
        throw error; // Re-throw to handle in UI
    }
}