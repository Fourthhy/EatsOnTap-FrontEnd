import axios from 'axios'; // Ensure you have this import

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST

export async function approveMealEligibilityRequest(eligibilityId) {
    const targetUrl = `${VITE_BASE_URL}/api/admin/basicEdApprove/${encodeURIComponent(eligibilityId)}`;
    
    console.log("🌐 Approving Meal Request with ID:", eligibilityId, "in", targetUrl); 
    
    try {
        const response = await axios.put(targetUrl);
        
        // Return true or the data so the calling function knows it succeeded
        return response.data; 
    } catch (error) {
        console.error("❌ Error approving meal request:", error);
        throw error; // Re-throw so the frontend (Table) can show an error alert
    }
}