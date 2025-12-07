import { HeaderBar } from "../HeaderBar"
import { MealClaimRecordsTable } from "./MealClaimRecordsTable";

function DailyClaimRecords() {
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
                        <MealClaimRecordsTable />
                    </div>
                </div>
            </div>
        </>
    )
}

export { DailyClaimRecords }