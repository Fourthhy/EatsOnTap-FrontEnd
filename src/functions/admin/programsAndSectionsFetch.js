const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

export async function fetchProgramsAndSection() {
    // We use VITE_LOCALHOST for development to match your other working functions
    const targetUrl = `${VITE_BASE_URL}/api/fetch/getProgramsAndSections`;
    
    console.log("🌐 Fetching Programs & Sections from:", targetUrl);
    
    try {
        const response = await fetch(targetUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch programs: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Log the data to verify the structure (Category -> Levels -> Sections)
        console.log("📦 Programs Data Received:", data);
        
        return data;
        
    } catch (error) {
        console.error('Error fetching programs and sections:', error);
        return []; // Return empty array to prevent UI crashes
    }
}