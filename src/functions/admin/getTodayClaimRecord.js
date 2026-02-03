const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST

export async function getTodayClaimRecord() {
    const targetUrl = `${VITE_BASE_URL}/api/fetch/getTodayClaimRecord`
    try {
        const response = await fetch(targetUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch claim record: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error Fetching Claim Record Data:', error);
        return []; // Return empty array to prevent UI crashes
    }
}