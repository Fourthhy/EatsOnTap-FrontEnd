import { HeaderBar } from "./components/HeaderBar";
import { EventDashboard } from "./components/eventManagement/EventDashoard";

export default function ScheduleStudentEligibility() {
    const USER_AVATAR = "https://randomuser.me/api/portraits/lego/3.jpg";

    return (
        <>
            <div
                style={{ backgroundColor: "#F7F9F9" }}
                className="w-full h-[100vh] flex flex-col">

                <HeaderBar headerTitle="Schedule Student Eligibility" userAvatar={USER_AVATAR} />
                <div className="w-full flex flex-col justify-start overflow-hidden">
                    <EventDashboard />
                </div>
            </div>
        </>
    )
}