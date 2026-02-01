const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export async function addProgramSchedule(scheduleData) {
    // ⚠️ CHECK ROUTE: Matches /api/programSchedule/addProgramSchedule
    const targetUrl = `${VITE_BASE_URL}/api/programSchedule/addProgramSchedule`;

    console.log("📅 Updating Schedule...", scheduleData);

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(scheduleData),
            credentials: 'include' // Required for Admin Logger if you add it later
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `Failed to set schedule: ${response.status}`);
        }

        console.log("✅ Schedule Set:", result);
        return result;

    } catch (error) {
        console.error("Error setting program schedule:", error);
        throw error;
    }
}