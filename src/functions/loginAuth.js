const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export async function loginApi(email, password) {
  // Helper to fetch all users and check for email
  const fetchAndFind = async (endpoint) => {
    const res = await fetch(`${VITE_BASE_URL}${endpoint}`);
    if (!res.ok) throw new Error('Failed to fetch');
    const list = await res.json();
    return list.find(u => u.email === email);
  };

  // Search for user
  let isUser = false;
  try {
    isUser = await fetchAndFind('/api/users/getAllUsers');
  } catch (err) {
    throw new Error('Error checking user collection');
  }

  // If not user, search for adviser
  let isAdviser = false;
  if (!isUser) {
    try {
      isAdviser = await fetchAndFind('/api/classAdviser/getAllClassAdviser');
    } catch (err) {
      throw new Error('Error checking class adviser collection');
    }
  }

  // If neither found, error
  if (!isUser && !isAdviser) {
    throw new Error('No account with that email found.');
  }

  // Login with correct endpoint
  const endpoint = isUser ? '/api/auth/login' : '/api/auth/loginClassAdviser';
  const loginRes = await fetch(`${VITE_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const loginData = await loginRes.json();

  if (!loginRes.ok) {
    throw new Error(loginData.message || 'Login failed');
  }

  if (loginData.token) localStorage.setItem('authToken', loginData.token);

  return loginData;
}
