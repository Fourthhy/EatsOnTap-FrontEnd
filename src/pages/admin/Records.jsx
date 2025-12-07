import { HeaderBar } from "./components/HeaderBar"
import { MealClaimRecords } from "./components/mealClaimRecords/MealClaimRecords";

export default function Records() {
    const USER_AVATAR = "https://randomuser.me/api/portraits/lego/3.jpg";


    return (
        <>
            <div
                style={{
                    backgroundColor: "#F7F9F9",
                    marginBottom: "30px",
                }}
                className="w-full h-auto flex flex-col justify-start">
                <HeaderBar headerTitle="Records" userAvatar={USER_AVATAR} />
                <div className="w-full flex justify-center">
                    <div className="w-[95%]">
                        <MealClaimRecords />
                    </div>
                </div>
            </div>
        </>
    )
}