const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

export async function getStudentsWithProgramOnly() {
    // 🟢 Ensure the path matches your backend route prefix (e.g., /api/fetch/...)
    const targetUrl = `${VITE_BASE_URL}/api/fetch/getStudentsWithProgramOnly`;
    
    console.log("🌐 Fetching Students with Program Only from:", targetUrl);

    try {
        const response = await fetch(targetUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch students: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        console.log("📦 Students with Program Data Received:", data);

        return data;
    } catch (error) {
        console.error('Error Fetching Students with Program Only:', error);
        return []; // Return empty array to prevent UI crashes
    }
}