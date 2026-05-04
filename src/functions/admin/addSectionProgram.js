const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const BASE_URL = VITE_BASE_URL;

// 🟢 Function to submit the Section/Program
const addSectionProgram = async (sectionData) => {

    // ⚠️ IMPORTANT: Ensure this matches your actual Route definition in backend
    // Example: router.post('/add', addSectionProgram) inside /api/sectionProgram routes
    const targetUrl = `${BASE_URL}/api/sectionprogram/addSectionProgram`;

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sectionData),
        });

        // 🟢 DEBUGGING: Read text first to catch HTML errors
        const responseText = await response.text();

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (jsonError) {
            // If this runs, it means the server returned HTML (likely a 404 or index.html)
            console.error("❌ CRITICAL ERROR: Server returned HTML instead of JSON.");
            console.error("Response Body:", responseText); // Check this in console!
            throw new Error(`Server returned invalid format (HTML). Check your API URL: ${targetUrl}`);
        }

        if (!response.ok) {
            throw new Error(result.message || "Failed to add section/program");
        }

        return result;

    } catch (error) {
        console.error("Error submitting section:", error);
        throw error;
    }
};

export { addSectionProgram };