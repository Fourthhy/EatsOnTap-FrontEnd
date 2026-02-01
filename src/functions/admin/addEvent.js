const VITE_LOCALHOST = import.meta.env.VITE_LOCALHOST;
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const addEvent = async (eventData) => {
    try {
        const response = await fetch(`${VITE_BASE_URL}/api/event/addEvent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to create event");
        }

        return data;
    } catch (error) {
        console.error("Error creating event:", error);
        throw error;
    }
};