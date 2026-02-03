// 🟢 FIX: Use import.meta.env for Vite projects
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST; 
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL

export const resetUserPasswordToDefault = async (email) => {
    // 🟢 Safety Check: Ensure the URL is defined
    if (!VITE_BASE_URL) {
        console.error("VITE_BASE_URL is not defined in .env");
        throw new Error("Configuration Error: Backend URL missing.");
    }

    try {
        // Ensure the slash is handled correctly
        const targetUrl = `${VITE_BASE_URL}/api/auth/resetToDefaultPassword`; // ⚠️ Check if your backend route needs '/api' or '/users' prefix
        const response = await fetch(`${VITE_BASE_URL}/api/auth/resetToDefaultPassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify({ email }),
        });

        // 🟢 Handle Non-JSON responses (like 404 HTML pages) BEFORE parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error(`Server returned non-JSON response (Status: ${response.status}). Check your backend URL/Route.`);
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to reset password.");
        }

        return data;

    } catch (error) {
        console.error("Error in resetUserPasswordToDefault:", error);
        throw error; 
    }
};