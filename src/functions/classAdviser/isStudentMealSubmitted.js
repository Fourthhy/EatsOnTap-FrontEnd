const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

export async function isStudentMealSubmitted(section) {
  // don't forget change to VITE_BASE_URL when deploying
  const token = localStorage.getItem('authToken');
  const response = await fetch(
    `${VITE_LOCALHOST}/api/eligibility/fetchRequestsBySection/${encodeURIComponent(section)}`,
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

  if (!response.ok) {
    throw new Error(data.message || 'fetch failed');
  }

  // If your API returns { submitted: true } or something meaningful, adjust here:
  if (!data || (Array.isArray(data) && data.length === 0)) return false;
  return true;
}
