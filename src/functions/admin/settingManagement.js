// src/functions/settingManagement.js
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

// Use VITE_LOCALHOST for local testing if needed, or VITE_BASE_URL for production
const BASE_URL = VITE_LOCALHOST; // Change to VITE_LOCALHOST if testing locally without deployed backend

/**
 * Suspends meal operations for a specific date range.
 * @param {Object} payload - { startDate, endDate, reason }
 */
async function suspendOperations(payload) {
    // Note: Adjust '/api/settings/' if your router prefix is different!
    const targetUrl = `${BASE_URL}/api/setting/suspendOperations`;

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(payload) 
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Server Error: ${response.status}`);
        }

        return data;

    } catch (error) {
        console.error("❌ Error suspending operations:", error);
        throw error; 
    }
}

/**
 * Resumes meal operations and clears future suspensions.
 */
async function resumeOperations() {
    // Note: Adjust '/api/settings/' if your router prefix is different!
    const targetUrl = `${BASE_URL}/api/setting/resumeOperations`;

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Server Error: ${response.status}`);
        }

        return data;

    } catch (error) {
        console.error("❌ Error resuming operations:", error);
        throw error; 
    }
}

async function getActiveSuspension() {
    const targetUrl = `${BASE_URL}/api/setting/getActiveSuspension`;

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    } catch (error) {
        console.error("❌ Error fetching suspension status:", error);
        throw error; 
    }
}

export {
    suspendOperations,
    resumeOperations,
    getActiveSuspension
};