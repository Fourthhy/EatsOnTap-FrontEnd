const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

export async function getOverallClaimRecord() {
    const targetUrl = `${VITE_BASE_URL}/api/fetch/getStudentClaimReports`
    try {
        const response = await fetch(targetUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch overall claim record: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching overall claim records', error);
    }
}