import { HeaderBar } from "../../../../components/global/HeaderBar";
import { MealOrdersTable } from "../../components/mealOrders/MealOrdersTable"
import { useData } from "../../../../context/DataContext";

export default function MealRecipientOrder() {
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
                style={{ backgroundColor: "#F7F9F9" }} w
                className="w-full h-[100vh] flex flex-col">
                <HeaderBar
                    userAvatar={USER_AVATAR}
                    headerTitle={"Meal Orders Management"}
                    userEmail={userEmail}
                    userName={userName}
                    userRole={userRole}
                />
                <div className="w-full flex justify-center">
                    <div className="w-[98%]">
                        <MealOrdersTable />
                    </div>
                </div>
            </div>

        </>
    )
}