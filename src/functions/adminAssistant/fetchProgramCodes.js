const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

// 🟢 Function to fetch unique Program-Year codes
export async function fetchProgramCodes() {
    
    // ⚠️ CHECK PREFIX: Ensure '/api/students' matches your server.js mount point
    const targetUrl = `${VITE_BASE_URL}/api/students/fetchProgramCodes`;
    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Failed to fetch program codes: ${response.status}`);
        }
        return data.data; // Returns the array ["ACT - 1", "BSIT - 2", ...]

    } catch (error) {
        console.error('Error fetching program codes:', error);
        return []; // Return empty array to prevent UI crashes
    }
}