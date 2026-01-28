const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Claims a food item and deducts balance from the student.
 * @param {string} studentInput - The Student ID or RFID Tag.
 * @param {number} amount - The cost of the item to deduct.
 */
export async function claimFoodItem(studentInput, amount) {
    // Construct the URL (adjust the path '/api/claim/' to match your actual route prefix)
    const targetUrl = `${VITE_LOCALHOST}/api/claim/fakeFoodItemClaim`;

    console.log(`🌐 Deducting ${amount} from student:`, studentInput);

    try {
        const response = await fetch(targetUrl, {
            method: 'POST', // POST because we are modifying the balance
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                studentInput: studentInput,
                amount: Number(amount) // Ensure it's a number
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Transaction failed: ${response.status}`);
        }

        console.log("✅ Transaction Successful:", data);
        return data; // Returns { message, remainingBalance, etc. }

    } catch (error) {
        console.error("❌ Claim Error:", error);
        throw error;
    }
}