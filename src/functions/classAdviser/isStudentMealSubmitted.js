const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export async function isStudentMealSubmitted(section) {
  const response = await fetch(
    `${VITE_BASE_URL}/api/eligiblity/fetchRequestsBySection/${encodeURIComponent(section)}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
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
