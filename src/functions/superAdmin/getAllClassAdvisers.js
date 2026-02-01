const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getAllClassAdvisers() {
    const targetUrl = `${VITE_BASE_URL}/api/classAdviser/getAllClassAdviser`;
    
    console.log("🌐 Fetching Class Advisers from:", targetUrl);

    try {
        const response = await fetch(targetUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch class advisers: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Log the data to verify the structure matches the Class Adviser Schema
        console.log("📦 Class Advisers Received:", data);

        return data;

    } catch (error) {
        console.error('Error fetching class advisers:', error);
        return []; // Return empty array to prevent UI crashes
    }
}