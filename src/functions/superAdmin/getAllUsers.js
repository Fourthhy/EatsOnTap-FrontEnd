const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getAllUsers() {
    // Note: Adjust '/api/user' if your route is mounted differently in server.js
    // e.g., if app.use('/api/fetch', userRoutes), then use /api/fetch/getAllUsers
    const targetUrl = `${VITE_BASE_URL}/api/users/getAllUsers`; 
    
    console.log("🌐 Fetching All Users from:", targetUrl);

    try {
        const response = await fetch(targetUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Log the data to verify the structure matches the Schema
        console.log("📦 Users Received:", data);

        return data;

    } catch (error) {
        console.error('Error fetching users:', error);
        return []; // Return empty array to prevent UI crashes
    }
}