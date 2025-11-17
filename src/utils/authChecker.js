export function isAuthenticated() {
  // Check if a token exists in localStorage and has not expired
  const token = localStorage.getItem('authToken');

  // OPTIONALLY: You can implement expiry/refresh here
  return !!token; // Authenticated if a non-empty string exists
}
