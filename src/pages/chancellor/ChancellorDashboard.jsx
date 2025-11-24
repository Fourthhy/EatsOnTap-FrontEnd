import { RiNotification2Fill } from "react-icons/ri"

export default function ChancellorDashboard() {
    const USER_AVATAR = "https://randomuser.me/api/portraits/lego/3.jpg";

    return (
        <>
            <div
                style={{
                    backgroundColor: "#F7F9F9",
                    marginBottom: "30px"
                }}
                className="w-full h-auto flex flex-col justify-start">
                <div
                    style={{
                        height: '60px',
                    }}
                    className="w-full flex flex-col">
                    <div
                        style={{
                            paddingLeft: '10px',
                            background: "white",
                            boxShadow: "0 10px 24px 0 rgba(214, 221, 224, 0.32)"
                        }}
                        className="flex-1 flex items-center gap-4 justify-between"
                    >
                        <div className="w-auto h-auto flex gap-4">
                            <p
                                style={{ fontWeight: '500' }}
                                className="font-geist text-[2vh]"> Dashboard
                            </p>
                        </div>

                        <div
                            style={{
                                marginRight: "20px"
                            }}
                            className="w-auto h-auto flex flex-row gap-5 items-center">
                            <div
                                style={{
                                    margin: "0px 15px 0px 0px",
                                    padding: 5,
                                    borderRadius: 14
                                }}
                                className="bg-[#D9D9D9] w-auto h-full flex items-center">
                                <RiNotification2Fill size={20} />
                            </div>
                            <div>
                                <div className="w-[100%] h-[100%] flex flex-col items-center">
                                    <span
                                        style={{
                                            fontFamily: "geist",
                                            color: "#000",
                                            fontWeight: "500",
                                            fontSize: 14,
                                        }}
                                    >
                                        Name Surname
                                    </span>
                                    <p
                                        style={{
                                            fontFamily: "geist",
                                            color: "#B1AFB0",
                                            fontWeight: "500",
                                            fontSize: 11,
                                        }}
                                        className="w-[100%] flex justify-end"
                                    >Role</p>
                                </div>
                            </div>
                            <div className="w-auto h-auto">
                                <img style={{ height: 33, width: 35, borderRadius: 15 }} src={USER_AVATAR} alt="User Avatar" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}