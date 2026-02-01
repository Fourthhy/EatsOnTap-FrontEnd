const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export async function claimMeal(studentInput) {
    // ⚠️ CHECK ROUTE: Matches /api/claim/claim-meal
    const targetUrl = `${VITE_BASE_URL}/api/claim/claim-meal`;

    console.log("🍛 Processing Claim for:", studentInput);

    try {
        const response = await fetch(targetUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentInput }),
            // credentials: 'include' // Uncomment if you need to log *who* processed the claim (the admin/staff)
        });

        const result = await response.json();

        // Handle Specific Status Codes from Controller
        if (!response.ok) {
            // 404: Student not found / No daily record
            // 400: Not in eligible list / Insufficient balance
            // 409: Already claimed
            throw new Error(result.message || `Claim failed: ${response.status}`);
        }

        console.log("✅ Claim Successful:", result);
        return result; // Returns { message, data: { studentID, name, ... } }

    } catch (error) {
        console.error("Error processing claim:", error);
        throw error; // Re-throw to display specific message in UI
    }
}