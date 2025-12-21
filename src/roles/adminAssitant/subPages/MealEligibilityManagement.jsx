import { HeaderBar } from "../../../components/global/HeaderBar";
import { EligibilityScheduler } from "../components/EligibilityScheduler";

export default function MealEligibilityManagement() {
    const USER_AVATAR = "https://randomuser.me/api/portraits/lego/3.jpg";
    return (
        <>
            <div
                style={{
                    backgroundColor: "#F7F9F9",
                    marginBottom: "30px",
                }}
                className="w-full h-auto flex flex-col justify-start">
                <HeaderBar userAvatar={USER_AVATAR} headerTitle={"Voucher Management"} />
                <div className="w-full h-full flex justify-center overflow-y-hidden" style={{ paddingTop: 30 }}>
                    <div className="w-[95%] h-[calc(100vh-120px)] flex items-center">
                        <EligibilityScheduler />
                    </div>
                </div>
            </div>
        </>
    )
}