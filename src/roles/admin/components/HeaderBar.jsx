
import { Menu } from "lucide-react";
import { RiNotification2Fill } from "react-icons/ri";
import { useOutletContext } from "react-router-dom";


function HeaderBar({ userAvatar, headerTitle, userName = "Sample Name", userRole = "Sample Role" }) {
    const context = useOutletContext() || {};
    const handleToggleSidebar = context.handleToggleSidebar || (() => { });

    return (
        <>

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
                    <div className="w-auto h-auto flex gap-2">
                        <div className="w-auto h-auto">
                            <Menu size={20} onClick={handleToggleSidebar} className="hover:cursor-pointer" />
                        </div>
                        <p
                            style={{ fontWeight: '500' }}
                            className="font-geist text-[2vh]"> {headerTitle}
                        </p>
                    </div>

                    <div
                        style={{
                            marginRight: "20px"
                        }}
                        className="w-auto h-auto flex flex-row gap-2 items-center">
                        <div
                            style={{
                                padding: 5,
                                borderRadius: 14
                            }}
                            className="w-auto h-full flex items-center">
                            <RiNotification2Fill size={18} />
                        </div>

                        <div className="w-[150px] flex flex-row gap-3">
                            <div className="w-auto h-auto flex items-center justify-center">
                                <img
                                    style={{ borderRadius: 15, width: 46, height: 35, objectFit: 'cover' }}
                                    // src={userAvatar}
                                    src="https://xsgames.co/randomusers/avatar.php?g=male"
                                    alt="User Avatar"
                                />
                            </div>

                            <div className="w-[100%] h-[100%] flex flex-col items-start justify-start">
                                <span
                                    style={{
                                        fontFamily: "geist",
                                        color: "#000",
                                        fontWeight: "500",
                                        fontSize: 14,
                                    }}
                                >
                                    {userName}
                                </span>
                                <p
                                    style={{
                                        fontFamily: "geist",
                                        color: "#B1AFB0",
                                        fontWeight: "500",
                                        fontSize: 11,
                                    }}
                                    className="w-[100%] flex justify-start"
                                >
                                    {userRole}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}

export {
    HeaderBar
}