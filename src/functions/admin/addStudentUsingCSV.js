const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const BASE_URL = VITE_LOCALHOST;

export async function uploadStudentCSV(file) {
    // ⚠️ CHECK ROUTE: Matches /api/students/usingCSV
    // Derived from app.use('/api/students', ...) + router.post('/usingCSV', ...)
    const targetUrl = `${BASE_URL}/api/students/usingCSV`;

    const formData = new FormData();
    // The key 'students_information' must match upload.single('students_information') in your route
    formData.append('students_information', file);

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            // ⚠️ IMPORTANT: Do NOT set 'Content-Type': 'application/json' here.
            // The browser automatically sets the multipart/form-data header for FormData.
            body: formData, 
            credentials: 'include' 
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `Failed to upload CSV: ${response.status}`);
        }

        return result;

    } catch (error) {
        console.error("Error uploading student CSV:", error);
        throw error;
    }
}