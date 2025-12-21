import { useState } from "react";
import { HeaderBar } from "../../../../components/global/HeaderBar"
import { MealClaimRecordsTable } from "./MealClaimRecordsTable";
import { OverallClaims } from "./OverallClaims";

function DailyClaimRecords() {
    const USER_AVATAR = "https://randomuser.me/api/portraits/lego/3.jpg";
    const [view, setView] = useState("daily");
    const switchView = () => {
        setView(view === "daily" ? "overall" : "daily");
    }
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
                        {view === "daily" ?
                            <MealClaimRecordsTable switchView={switchView} />
                            :
                            <OverallClaims switchView={switchView} />
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export { DailyClaimRecords }