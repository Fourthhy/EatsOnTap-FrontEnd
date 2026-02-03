// Ensure this points to your backend URL (e.g., http://localhost:3000)
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

/**
 * Sends a password reset request (Forgot Password).
 * Triggers the backend to send an email with a reset link.
 * * @param {string} email - The user's email address.
 * @returns {Promise<Object>} - The response data (message).
 */
export async function resetPassword(email) {
    // Construct target URL: Base + Router Prefix + Endpoint
    const targetUrl = `${VITE_BASE_URL}/api/auth/resetPassword`;
    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // The controller expects { email: "..." } in the body
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        // Check for specific error codes (404: Email not found, 500: Email send failed)
        if (!response.ok) {
            throw new Error(data.message || "Failed to process reset request.");
        }
        return data; 

    } catch (error) {
        console.error("❌ Error in requestPasswordReset:", error);
        throw error; // Throw error so the frontend component can catch and display it
    }
}