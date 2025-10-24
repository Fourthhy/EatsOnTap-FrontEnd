const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export default async function submitMealList(userID, section, forEligible) {
    const response = await fetch(`${VITE_BASE_URL}/api/eligibility/submitListforBasicEduc`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            userID: userID,
            section: section,
            forEligible: forEligible
        })
    });
    const data = await response.json();
    if (!response.ok) {throw new Error(data.message) || 'fetch failed'};
    return data;
}