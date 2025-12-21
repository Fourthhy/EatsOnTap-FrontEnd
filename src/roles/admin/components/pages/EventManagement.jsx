import { HeaderBar } from "../../../../components/global/HeaderBar";
import { EventDashboard } from "../eventManagement/EventDashoard";

export default function EventManagement() {
    const USER_AVATAR = "https://randomuser.me/api/portraits/lego/3.jpg";

    return (
        <>
            <div
                style={{ backgroundColor: "#F7F9F9" }}
                className="w-full h-[100vh] flex flex-col">
                <HeaderBar headerTitle="Event Management" userAvatar={USER_AVATAR} />
                <div className="w-full h-[calc(100vh - 60px)] flex flex-col justify-start overflow-hidden">
                    <EventDashboard />
                </div>
            </div>
        </>
    )
}