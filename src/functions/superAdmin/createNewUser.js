const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

export async function createNewUser(userData) {
    // ⚠️ CHECK ROUTE: Matches /api/users/addUser
    const targetUrl = `${VITE_BASE_URL}/api/users/addUser`;

    console.log("👤 Adding new user...", targetUrl);

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            // Include credentials if your System Logger relies on req.user (Admin session)
            credentials: 'include' 
        });

        // Parse JSON regardless of status to get error messages
        const result = await response.json();

        if (!response.ok) {
            // Throw the specific error message from the backend (e.g., "User ID already exists")
            throw new Error(result.message || `Failed to add user: ${response.status}`);
        }

        console.log("✅ User created successfully:", result);
        return result;

    } catch (error) {
        console.error("Error adding user:", error);
        throw error; // Re-throw so the UI form can display the error
    }
}