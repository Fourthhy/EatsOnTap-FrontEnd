const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

// 🟢 Function to fetch the School Structure (Dept -> Year -> Sections)
export async function getSchoolStructure() {
    
    // ⚠️ CHECK ROUTE: Ensure this matches your server.js mount point
    // Example: router.get('/getSchoolStructure', studentController.getSchoolStructure)
    const targetUrl = `${VITE_LOCALHOST}/api/fetch/getSchoolStructure`;
    
    console.log("🌐 Fetching School Structure from:", targetUrl);

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch school structure: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Log to verify hierarchy (Category -> Levels -> Sections)
        console.log("📦 School Structure Received:", data);

        return data;
    } catch (error) {
        console.error('Error Fetching School Structure:', error);
        return []; // Return empty array to prevent UI crashes
    }
}