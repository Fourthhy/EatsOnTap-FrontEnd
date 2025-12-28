const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

export async function fetchStudentsBySection(section) {
  // 1. Retrieve the token from wherever you saved it (e.g., localStorage, context, or cookie)
  // Make sure the key matches what you set during login (e.g., 'token', 'userToken')
  const token = localStorage.getItem('authToken');

  try {
    const response = await fetch(`${VITE_LOCALHOST}/api/students/getSection/${encodeURIComponent(section)}`, {
      method: 'GET', // Explicitly stating method is good practice
      headers: {
        // 2. This is the part you were missing!
        // The backend expects: "Bearer <token>"
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      }
    });

    if (!response.ok) {
      // It's often helpful to parse the error message from the backend if available
      const errorData = await response.json().catch(() => ({})); 
      throw new Error(errorData.message || 'Failed to fetch students');
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
} 