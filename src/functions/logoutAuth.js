const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export async function logout() {
    // 1. Get the token to identify the Role before wiping
    const token = localStorage.getItem('authToken');
    
    // Default endpoint
    let endpoint = '/api/auth/logout'; 

    if (token) {
        try {
            // Decode the token to check the Role
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);

            // Role Routing: Ensure the backend hits the right collection
            if (payload.role === 'CLASS-ADVISER') {
                endpoint = '/api/auth/logoutClassAdviser';
            }

        } catch (error) {
            console.warn("⚠️ Could not decode token role. Defaulting to standard logout.");
        }
    }

    try {
        // 2. Call the Backend API
        // credentials: 'include' ensures the HTTP-Only Cookie is sent for wiping
        const response = await fetch(`${VITE_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include' 
        });

    } catch (error) {
        console.error("❌ Network error during logout:", error);
    } finally {
        // =========================================================
        // 🟢 THE FRONTEND WIPE & HISTORY KILLER
        // =========================================================
        
        // 1. Clear all authentication artifacts
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        
        // 2. Clear any other cached user data
        localStorage.clear();
        sessionStorage.clear();
    }
}