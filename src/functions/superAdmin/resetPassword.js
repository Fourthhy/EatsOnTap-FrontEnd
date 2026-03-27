const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST; // Unused here, but kept if you need it

async function resetPassword(userID) {
    // 1. Construct the target URL using the environment variable
    const targetUrl = `${VITE_BASE_URL}/api/users/resetPassword`;

    try {
        const response = await fetch(targetUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // 🟢 CRITICAL: Ensures session cookies/tokens are sent
            body: JSON.stringify({ userID }) // Passing the userID in the request body
        });

        // 2. Parse the JSON response
        const data = await response.json();

        // 3. Check if the request failed (400, 404, 500, etc.)
        if (!response.ok) {
            throw new Error(data.message || `Server Error: ${response.status}`);
        }

        // 4. Return the actual data
        return data;

    } catch (error) {
        console.error("❌ Error resetting password:", error);
        throw error; 
    }
}

export {
    resetPassword
}