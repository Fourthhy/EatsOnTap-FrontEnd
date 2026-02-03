const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export async function fetchApprovedStudents() {
    const targetUrl = `${VITE_BASE_URL}/api/fetch/getApprovedStudentsToday`;
    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch approved students: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return data; // Returns the bare array of student objects

    } catch (error) {
        console.error("❌ Error fetching approved students:", error);
        throw error; // Re-throw so the UI can handle the error state
    }
}