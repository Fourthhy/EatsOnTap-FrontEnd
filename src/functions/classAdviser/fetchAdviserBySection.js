const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
export async function fetchStudentsBySection(section) {
  // don't forget to change to VITE_BASE_URL when deploying
  try {
    const response = await fetch(`${VITE_BASE_URL}/api/students/getSection/${encodeURIComponent(section)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }

    const data = await response.json();
    return data; // assuming the backend returns an array of students
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
}
