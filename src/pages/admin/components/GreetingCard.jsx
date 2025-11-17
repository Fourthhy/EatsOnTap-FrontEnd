import { IconSun } from "@tabler/icons-react";

function GreetingCard({ title, subtitle }) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const totalMinutes = hours * 60 + minutes;

    // Define time ranges in minutes
    const morningStart = 0;                  // 12:00 AM
    const morningEnd = 11 * 60 + 59;         // 11:59 AM (719)

    const noonStart = 12 * 60;               // 12:00 PM (720)
    const noonEnd = 12 * 60;                 // 12:00 PM (720)

    const afternoonStart = 12 * 60 + 1;      // 12:01 PM (721)
    const afternoonEnd = 18 * 60;            // 6:00 PM (1080)

    const eveningStart = 18 * 60 + 1;        // 6:01 PM (1081)
    const eveningEnd = 23 * 60 + 59;         // 11:59 PM (1439)

    const greetingScript = () => {
        if (totalMinutes >= morningStart && totalMinutes <= morningEnd) {
            return "Morning";
        } else if (totalMinutes === noonStart) {
            return "Noon";
        } else if (totalMinutes >= afternoonStart && totalMinutes <= afternoonEnd) {
            return "Afternoon";
        } else if (totalMinutes >= eveningStart && totalMinutes <= eveningEnd) {
            return "Evening";
        } else {
            return "Unknown";
        }
    }



    return (
        <div style={{
            background: "#fff", borderRadius: 12, boxShadow: "0 2px 6px #e5eaf0",
            padding: 10, display: "flex", flexDirection: "column", width: 'auto', justifyContent: "center"
        }}>
            <div className="h-full w-full flex flex-col justify-center">
                <span
                    style={{
                        fontSize: 22,
                        fontWeight: "500",
                        color: "#000000",
                        fontFamily: "geist"
                    }}
                >
                    Good {greetingScript()}!
                </span>
                <span
                    style={{
                        color: "#000000",
                        fontSize: 12,
                        fontFamily: "geist"
                    }}>
                    {subtitle}
                </span>
            </div>
            <div>
                <img src="/admin/Morning_Sun.svg" alt="Morning Sun Icon" />
            </div>
        </div>
    );
}

export {
    GreetingCard
}