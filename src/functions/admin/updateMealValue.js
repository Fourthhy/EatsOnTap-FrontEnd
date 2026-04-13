const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export async function updateMealValue(mealValue) {
    const targetUrl = `${VITE_BASE_URL}/api/mealvalue/updateMealValue`;
    try {
        const response = await fetch(targetUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            // Sending the numeric value your backend controller expects
            body: JSON.stringify({ mealValue }) 
        });

        const data = await response.json();

        if (!response.ok) {
            // Throw the specific error message from the backend 
            throw new Error(data.message || `Failed to update meal value: ${response.status}`);
        }
        
        return data;

    } catch (error) {
        throw error; // Re-throw so the UI can handle the alert/toast
    }
}