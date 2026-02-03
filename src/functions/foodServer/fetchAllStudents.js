const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

// 🟢 Function to fetch ALL students (Raw List)
export async function fetchAllStudents() {
    
    // ⚠️ CHECK ROUTE: Ensure this matches your backend route definition
    // Example: router.get('/getAllStudents', studentController.getAllStudents)
    const targetUrl = `${VITE_BASE_URL}/api/students/getAllStudents`;
    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch students: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error Fetching All Students:', error);
        return []; // Return empty array to keep the app running
    }
}