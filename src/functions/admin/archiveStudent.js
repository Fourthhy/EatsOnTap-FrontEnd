const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const BASE_URL = VITE_BASE_URL;

export const archiveStudent = async ({ id }) => {
    try {
        const response = await fetch(`${BASE_URL}/api/students/archiveStudent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id }) 
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error archiving students');
        }

        return data;
    } catch (error) {
        console.error('Error archiving student: ', error);
        // Returning a structured object here helps your SelectionActionBar handle the error gracefully
        return { success: false, message: error.message };
    }
}