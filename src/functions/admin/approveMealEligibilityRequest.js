const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

export async function approveMealEligibilityRequest(eligibilityId) {
    // Ensure the ID is properly encoded in the URL
    const targetUrl = `${VITE_BASE_URL}/api/admin/basicEdApprove/${encodeURIComponent(eligibilityId)}`;

    try {
        const response = await fetch(targetUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        // 1. Parse the JSON response
        const data = await response.json();

        // 2. Check if the request failed (400, 404, 500, etc.)
        if (!response.ok) {
            throw new Error(data.message || `Server Error: ${response.status}`);
        }

        // 3. Return the actual data
        return data;

    } catch (error) {
        console.error("❌ Error approving meal request:", error);
        throw error; 
    }
}