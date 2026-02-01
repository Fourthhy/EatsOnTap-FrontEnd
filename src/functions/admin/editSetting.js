const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL

export async function editSetting(updateData) {
    // ⚠️ CHECK ROUTE: Matches /api/setting/editSetting
    const targetUrl = `${VITE_BASE_URL}/api/setting/editSetting`;

    console.log(`⚙️ Updating Setting '${updateData.settingName}'...`, updateData);

    try {
        const response = await fetch(targetUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
            credentials: 'include' // Required if you add System Logging later
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `Failed to update setting: ${response.status}`);
        }

        console.log("✅ Setting Updated:", result);
        return result;

    } catch (error) {
        console.error("Error updating setting:", error);
        throw error;
    }
}