const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

export async function SubmitStudentMealList(userID, section, forEligible) {
    //do not forget to change to VITE_BASE_URL when deploying
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${VITE_BASE_URL}/api/eligibility/submitListforBasicEduc`, {
        method: 'POST',
        headers: {
            // 2. This is the part you were missing!
            // The backend expects: "Bearer <token>"
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            requesterID: userID,
            section: section,
            forEligibleStudentIDs: forEligible
        })
    });
    const data = await response.json();
    if (!response.ok) { throw new Error(data.message) || 'fetch failed' };
    return data;
}