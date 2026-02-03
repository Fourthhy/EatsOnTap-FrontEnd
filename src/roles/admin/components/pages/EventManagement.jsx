import { HeaderBar } from "../../../../components/global/HeaderBar";
import { EventDashboard } from "../eventManagement/EventDashoard";
import { useData } from "../../../../context/DataContext";

export default function EventManagement() {
    const { userInformation } = useData();
    const USER_AVATAR = "https://randomuser.me/api/portraits/lego/3.jpg";

    // Safe User Info
    const userEmail = userInformation?.email || "No Email";
    const userName = (userInformation?.last_name && userInformation?.first_name)
        ? `${userInformation.last_name}, ${userInformation.first_name}`
        : "Admin User";
    const userRole = userInformation?.role || "Guest";

    return (
        <>
            <div
                style={{ backgroundColor: "#F7F9F9" }}
                className="w-full h-[100vh] flex flex-col">
                <HeaderBar
                    userAvatar={USER_AVATAR}
                    headerTitle={"Event Management"}
                    userEmail={userEmail}
                    userName={userName}
                    userRole={userRole}
                />
                <div className="w-full h-[calc(100vh - 60px)] flex flex-col justify-start overflow-hidden">
                    <EventDashboard />
                </div>
            </div>
        </>
    )
}