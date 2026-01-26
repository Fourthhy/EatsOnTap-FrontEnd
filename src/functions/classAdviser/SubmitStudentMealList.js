const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

// 🟢 UPDATE: Added 'forAbsent' parameter
export async function SubmitStudentMealList(userID, section, forEligible, forAbsent) {
    // do not forget to change to VITE_BASE_URL when deploying
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${VITE_LOCALHOST}/api/eligibility/submitListforBasicEduc`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            requesterID: userID,
            section: section,
            forEligibleStudentIDs: forEligible,
            // 🟢 UPDATE: Included this field
            forAbsentStudentIDs: forAbsent || [] 
        })
    });

    const data = await response.json();
    if (!response.ok) { 
        throw new Error(data.message || 'fetch failed'); 
    }
    return data;
}