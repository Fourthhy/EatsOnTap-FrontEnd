import { HeaderBar } from "./components/HeaderBar";
import { EventDashboard } from "./components/eventManagement/EventDashoard";

export default function ScheduleStudentEligibility() {
    const USER_AVATAR = "https://randomuser.me/api/portraits/lego/3.jpg";

    return (
        <>
            <div
                style={{
                    backgroundColor: "#F7F9F9",
                    marginBottom: "30px"
                }}
                className="w-full h-auto flex flex-col justify-start">
                <HeaderBar headerTitle="Schedule Student Eligibility" userAvatar={USER_AVATAR} />
                <div className="w-full h-auto flex flex-col justify-start">
                    <EventDashboard />
                </div>
            </div>
        </>
    )
}