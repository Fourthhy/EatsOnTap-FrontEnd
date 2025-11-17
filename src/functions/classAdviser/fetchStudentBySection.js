const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
export async function fetchStudentsBySection(section) {
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
