// utils/authChecker.js

export const getAuthData = () => {
    const token = localStorage.getItem('authToken');
    const lastActivity = localStorage.getItem('lastActivity');
    
    if (!token) return null;

    // 1. Inactivity Check (30 Minutes)
    if (lastActivity) {
        const thirtyMinutes = 30 * 60 * 1000;
        if (Date.now() - parseInt(lastActivity) > thirtyMinutes) {
            localStorage.clear();
            return null;
        }
    }

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);

        if (Date.now() >= payload.exp * 1000) {
            localStorage.clear();
            return null;
        }

        // Update activity
        localStorage.setItem('lastActivity', Date.now().toString());

        return {
            id: payload.id,
            role: payload.role
        };
    } catch (error) {
        return null;
    }
};