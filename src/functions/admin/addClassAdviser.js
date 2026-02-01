const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

// 🟢 Function to submit the Class Adviser
const addClassAdviser = async (adviserData) => {

    // ⚠️ IMPORTANT: Check your server.js/app.js to see what the prefix is.
    // Usually it is: app.use('/api/classAdviser', classAdviserRoutes)
    const targetUrl = `${VITE_BASE_URL}/api/classAdviser/addClassAdviser`;

    console.log("🌐 Adding Class Adviser to:", targetUrl);

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}` // Uncomment if you need auth later
            },
            body: JSON.stringify(adviserData),
        });

        // 🟢 DEBUGGING: Read text first to catch HTML errors (404s)
        const responseText = await response.text();

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (jsonError) {
            console.error("❌ CRITICAL ERROR: Server returned HTML instead of JSON.");
            console.error("Response Body:", responseText);
            throw new Error(`Server returned invalid format (HTML). Check your API URL: ${targetUrl}`);
        }

        if (!response.ok) {
            throw new Error(result.message || "Failed to create Class Adviser account");
        }

        return result;

    } catch (error) {
        console.error("Error creating adviser:", error);
        throw error;
    }
};

export { addClassAdviser };