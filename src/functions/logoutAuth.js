const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL

export async function logout() {
    // 1. Get the token from storage to identify WHO is logged in
    const token = localStorage.getItem('authToken');
    
    // Default endpoint (Regular User)
    let endpoint = '/api/auth/logout'; 

    // 2. Decode the token to check the Role
    if (token) {
        try {
            // Simple JWT decode (Header.Payload.Signature)
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);

            // 🟢 CHECK ROLE: If it's a Class Adviser, switch the endpoint
            if (payload.role === 'CLASS-ADVISER') {
                endpoint = '/api/auth/logoutClassAdviser';
            }
            
            console.log(`👤 Detected Role: ${payload.role}. Calling: ${endpoint}`);

        } catch (error) {
            console.warn("⚠️ Could not decode token role. Defaulting to User logout.");
        }
    }

    console.log("🚪 Attempting to log out...");

    try {
        // 3. Call the Backend API
        // ⚠️ CRITICAL: credentials: 'include' ensures the HTTP-Only Cookie is sent to the backend
        const response = await fetch(`${VITE_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include' 
        });

        if (!response.ok) {
            console.warn("Server returned error during logout, but proceeding to clear client session.");
        } else {
            console.log("✅ Database status updated to Inactive.");
        }

    } catch (error) {
        console.error("❌ Network error during logout:", error);
    } finally {
        // 4. ALWAYS Clean up the Frontend (even if server fails)
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        
        // Optional: Force reload to clear any React state
        window.location.reload();
    }
}