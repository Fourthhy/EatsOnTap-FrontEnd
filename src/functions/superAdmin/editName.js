// src/functions/userManagement.js
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;

async function editName(userID, nameData) {
    const targetUrl = `${VITE_BASE_URL}/api/users/editName`;

    try {
        const response = await fetch(targetUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            // Pass the userID and the name payload together
            body: JSON.stringify({ userID, ...nameData }) 
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Server Error: ${response.status}`);
        }

        return data;

    } catch (error) {
        console.error("❌ Error editing user name:", error);
        throw error; 
    }
}

export {
    editName
}