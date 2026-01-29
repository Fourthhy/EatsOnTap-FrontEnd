import { HeaderBar } from "../../../../components/global/HeaderBar";
import { StudentList } from "../StudentList";

export default function HEStudentManagement() {
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
                <div className="w-full flex justify-center">
                    <div className="w-[98%]">
                        <StudentList />
                    </div>
                </div>
            </div>
        </>
    )
}