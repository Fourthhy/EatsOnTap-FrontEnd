const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export async function loginApi(email, password) {
  try {
    const response = await fetch(`${VITE_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // Check if login succeeded first
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Ensure token exists before storing
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    } else {
      console.warn('No token returned from backend');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
