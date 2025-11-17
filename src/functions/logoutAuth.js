export function logout() {
  // Remove stored token (adjust key if different)
  localStorage.removeItem('authToken'); 
  sessionStorage.removeItem('authToken'); // if you use sessionStorage too
}
