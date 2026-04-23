const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const BASE_URL = VITE_LOCALHOST;

export const archiveStudent = async (studentID) => {
    try {
        const response = await fetch(`${BASE_URL}/api/students/archiveStudent`, {
            method: 'POST',
            headers: {
                'Content/type': 'application/json'
            },
            body: JSON.stringify(studentID)
        });

        const data = await response.json();

        if(!response.ok) {
            throw new Error(data.message || 'Error archiving students');
        }

        return data;
    } catch (error) {
        console.error('Error archiving student');
        throw error;
    }
}