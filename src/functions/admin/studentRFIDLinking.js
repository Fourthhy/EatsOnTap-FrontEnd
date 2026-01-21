const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export async function studentRFIDLinking(studentID, rfidTag) {
    const targetUrl = `${VITE_BASE_URL}/api/students/rfidLink/${encodeURIComponent(studentID)}`;
    console.log("🌐 Linking Student to RFID at:", targetUrl);

    try {
        const response = await fetch(targetUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rfidTag }) // Sending the data your backend expects
        });

        const data = await response.json();

        if (!response.ok) {
            // Throw the specific error message from the backend (e.g. "RFID already linked")
            throw new Error(data.message || `Failed to link: ${response.status}`);
        }

        console.log("📦 RFID Linked!", data);
        return data;

    } catch (error) {
        throw error; // Re-throw so the UI can handle the alert
    }
}