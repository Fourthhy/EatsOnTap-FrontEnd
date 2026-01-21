const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

export async function getSectionProgramList() {
    console.log("🌐 Fetching Overall Claim Record Data from:", targetUrl); 
    const targetUrl = `${VITE_LOCALHOST}/api/fetch/getSectionProgramList`

    try {
        const response = await fetch(targetUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch section program data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("📦 SectionProgram Data Received:", data);
    } catch (error) {
        throw new Error('Error fetching sectionprogram data', error);
    }
}