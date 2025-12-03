import { HeaderBar } from "./components/HeaderBar";
import { MealOrdersTable } from "./components/mealOrders/MealOrdersTable"

export default function MealRecipientOrder() {
    const USER_AVATAR = "https://randomuser.me/api/portraits/lego/3.jpg";
    return (
        <>
            <div
                style={{ backgroundColor: "#F7F9F9" }}
                className="w-full h-[100vh] flex flex-col">
                <HeaderBar headerTitle="Meal Recipient Orders" userAvatar={USER_AVATAR} />
                <div className="w-full h-[calc(100vh - 60px)] flex flex-col justify-start overflow-hidden">
                    <MealOrdersTable />

                </div>
            </div>

        </>
    )
}