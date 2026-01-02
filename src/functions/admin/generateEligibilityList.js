import axios from 'axios';

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST

export async function generateEligibilityList(section, forEligibleStudentIds) {
    const targetUrl = `${VITE_BASE_URL}/api/admin/generateEligibilityList`;
    
    console.log(`🌐 Submitting Eligibility List for Section: ${section}`);
    
    try {
        // The backend expects "section" and "forEligibleStudentIds" in the body
        const response = await axios.post(targetUrl, {
            section: section,
            forEligibleStudentIds: forEligibleStudentIds
        });

        // Return the success data (message, counts, etc.)
        return response.data;
    } catch (error) {
        console.error("❌ Error generating eligibility list:", error);
        // Throw the error so the UI can catch it and show an alert/toast
        throw error;
    }
}