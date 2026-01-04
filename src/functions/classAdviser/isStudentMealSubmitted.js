const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

export async function isStudentMealSubmitted(section) {
  // don't forget change to VITE_BASE_URL when deploying
  const token = localStorage.getItem('authToken');
  const endpoint = `${VITE_BASE_URL}/api/eligibility/fetchRequestsBySection/${encodeURIComponent(section)}`
  console.log(`Tyring to check if the section ${section} submitted their request at ${endpoint}`);
  const response = await fetch(
    endpoint,
    {
      method: 'GET',
      headers: {
        // 2. This is the part you were missing!
        // The backend expects: "Bearer <token>"
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    }
  );
  const data = await response.json();
  console.log("=== DATA FROM CHECKING IS STUDENT MEAL SUBMITTED RECEIVED ===");
  console.log(data)

  if (data.isSubmitted === true) {
    return true
  } else {
    return fasle
  }
}