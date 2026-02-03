import { HeaderBar } from "../../../../components/global/HeaderBar";
import { StudentList } from "../voucherManagement/StudentList";
import { useData } from "../../../../context/DataContext";

export default function StudentManagement() {
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
                style={{
                    backgroundColor: "#F7F9F9",
                    marginBottom: "30px",
                }}
                className="w-full h-auto flex flex-col justify-start">
                <HeaderBar
                    userAvatar={USER_AVATAR}
                    headerTitle={"Student Management"}
                    userEmail={userEmail}
                    userName={userName}
                    userRole={userRole}
                />
                <div className="w-full flex justify-center">
                    <div className="w-[98%]">
                        <StudentList />
                    </div>
                </div>
            </div>
        </>
    )
}