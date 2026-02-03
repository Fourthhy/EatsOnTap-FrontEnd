const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

export async function getAllClassAdvisers() {
    const targetUrl = `${VITE_BASE_URL}/api/fetch/getAllClassAdvisers`;
    try {
        const response = await fetch(targetUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch class advisers: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching class advisers:', error);
        return []; // Return empty array to prevent UI crashes
    }
}