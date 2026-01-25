const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

// 🟢 CHANGE: Accept the settingName as an argument
export async function isSettingActive(settingName) {
    if (!settingName) throw new Error("Setting name is required");

    try {
        // 🟢 CHANGE: Append the name to the URL
        const response = await fetch(`${VITE_BASE_URL}/api/setting/fetchSetting/${settingName}`);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Return the boolean value (true/false)
        return data.isActive; 

    } catch (error) {
        console.error(error);
        return false; // Default to false on error to prevent crashes
    }
}