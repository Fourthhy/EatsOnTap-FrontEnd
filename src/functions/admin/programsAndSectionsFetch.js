const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

export async function fetchProgramsAndSection() {
    //don't forget to chagne to VITE_BASE_URL upon deployment
    console.log("🌐 Fetching from:", `${import.meta.env.VITE_BASE_URL}/api/fetch/getProgramsAndSections`);
    try {
        const response = await fetch(`${VITE_BASE_URL}/api/fetch/getProgramsAndSections`);
        if (!response.ok) {
            throw new Error('Failed to fetch programs and sections');
        }
        const data = await response.json()
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching programs and sections:', error);
    }
}