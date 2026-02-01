const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

export async function createNewClassAdviser(adviserData) {
    const targetUrl = `${VITE_BASE_URL}/api/classAdviser/addClassAdviser`;

    console.log("👨‍🏫 Adding Class Adviser...", targetUrl);

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adviserData),
            credentials: 'include' // Required for Admin Logger (req.user)
        });

        const result = await response.json();

        if (!response.ok) {
            // Throw specific backend error (e.g., "Duplicate detected")
            throw new Error(result.message || `Failed to add adviser: ${response.status}`);
        }

        console.log("✅ Adviser created:", result);
        return result; // Contains { message, data: { initialPassword, email, ... } }

    } catch (error) {
        console.error("Error adding class adviser:", error);
        throw error;
    }
}