function ScheduleTabs({ children, selectedTab, onTabChange }) {
    return (
        <div>
            <div className="w-full bg-white">
                <div style={{ paddingBottom: 20 }} className="flex flex-col bg-[#F7F9F9]">
                    <span
                        style={{
                            fontWeight: "500",
                            fontSize: 20,
                            color: "#000000",
                            fontFamily: "geist",
                            width: "fit-content",
                            height: "fit-content",
                            paddingLeft: 15,
                            fontFamily: "geist",
                        }}
                    >
                        Eligible Programs
                    </span>
                    <span
                        style={{
                            fontWeight: "450",
                            fontSize: 13,
                            color: "#2D2D2D",
                            fontFamily: "geist",
                            width: "fit-content",
                            height: "fit-content",
                            paddingLeft: 15,
                            fontFamily: "geist",
                        }}
                    >
                        For Higher Education Students
                    </span>
                </div>

                <div className="flex w-full">
                    {/* MONDAY */}
                    <div className="w-3 bg-[#9da7e380]">
                        <div
                            className="h-full w-full bg-[#F7F9F9]"
                            style={{ borderBottomRightRadius: selectedTab === 1 ? 10 : 0 }}
                        >
                        </div>
                    </div>
                    <button
                        className="flex-1 min-w-0" // Added flex-1 to stretch
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 0", // Changed from fixed horizontal padding to 0 so it fits small containers
                            cursor: "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                            boxShadow: "2px 0 5px #e5eaf0",
                            backgroundColor: selectedTab === 1 ? "#9da7e380" : "#FFFFFF"
                        }}
                        onClick={() => onTabChange(1)}
                    >
                        Monday
                    </button>

                    {/* TUESDAY */}
                    <div className="w-3 bg-[#9da7e380]">
                        <div
                            className="h-full w-full bg-[#F7F9F9]"
                            style={{
                                borderBottomRightRadius: selectedTab === 1 ? 0 : selectedTab === 2 ? 10 : 0,
                                borderBottomLeftRadius: selectedTab === 1 ? 10 : 0,
                            }}
                        >
                        </div>
                    </div>
                    <button
                        className="flex-1 min-w-0"
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 0",
                            cursor: "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                            boxShadow: "2px 0 5px #e5eaf0",
                            backgroundColor: selectedTab === 2 ? "#9da7e380" : "#FFFFFF"
                        }}
                        onClick={() => onTabChange(2)}
                    >
                        Tuesday
                    </button>

                    {/* WEDNESDAY */}
                    <div className="w-3 bg-[#9da7e380]">
                        <div
                            className="h-full w-full bg-[#F7F9F9]"
                            style={{
                                borderBottomRightRadius: selectedTab === 2 ? 0 : selectedTab === 3 ? 10 : 0,
                                borderBottomLeftRadius: selectedTab === 2 ? 10 : 0,
                            }}
                        >
                        </div>
                    </div>
                    <button
                        className="flex-1 min-w-0"
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 0",
                            cursor: "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                            boxShadow: "2px 0 5px #e5eaf0",
                            backgroundColor: selectedTab === 3 ? "#9da7e380" : "#FFFFFF"
                        }}
                        onClick={() => onTabChange(3)}
                    >
                        Wednesday
                    </button>

                    {/* THURSDAY */}
                    <div className="w-3 bg-[#9da7e380]">
                        <div
                            className="h-full w-full bg-[#F7F9F9]"
                            style={{
                                borderBottomRightRadius: selectedTab === 3 ? 0 : selectedTab === 4 ? 10 : 0,
                                borderBottomLeftRadius: selectedTab === 3 ? 10 : 0,
                            }}
                        >
                        </div>
                    </div>
                    <button
                        className="flex-1 min-w-0"
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 0",
                            cursor: "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                            boxShadow: "2px 0 5px #e5eaf0",
                            backgroundColor: selectedTab === 4 ? "#9da7e380" : "#FFFFFF"
                        }}
                        onClick={() => onTabChange(4)}
                    >
                        Thursday
                    </button>

                    {/* FRIDAY */}
                    <div className="w-3 bg-[#9da7e380]">
                        <div
                            className="h-full w-full bg-[#F7F9F9]"
                            style={{
                                borderBottomRightRadius: selectedTab === 4 ? 0 : selectedTab === 5 ? 10 : 0,
                                borderBottomLeftRadius: selectedTab === 4 ? 10 : 0,
                            }}
                        >
                        </div>
                    </div>
                    <button
                        className="flex-1 min-w-0"
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 0",
                            cursor: "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                            boxShadow: "2px 0 5px #e5eaf0",
                            backgroundColor: selectedTab === 5 ? "#9da7e380" : "#FFFFFF"
                        }}
                        onClick={() => onTabChange(5)}
                    >
                        Friday
                    </button>

                    {/* SATURDAY */}
                    <div className="w-3 bg-[#9da7e380]">
                        <div
                            className="h-full w-full bg-[#F7F9F9]"
                            style={{
                                borderBottomRightRadius: selectedTab === 5 ? 0 : selectedTab === 6 ? 10 : 0,
                                borderBottomLeftRadius: selectedTab === 5 ? 10 : 0,
                            }}
                        >
                        </div>
                    </div>
                    <button
                        className="flex-1 min-w-0"
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 0",
                            cursor: "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                            boxShadow: "2px 0 5px #e5eaf0",
                            backgroundColor: selectedTab === 6 ? "#9da7e380" : "#FFFFFF"
                        }}
                        onClick={() => onTabChange(6)}
                    >
                        Saturday
                    </button>

                    {/* CLOSING SPACER FOR SATURDAY */}
                    <div className="w-3 bg-[#9da7e380]">
                        <div
                            className="h-full w-full bg-[#F7F9F9]"
                            style={{
                                borderBottomRightRadius: selectedTab === 6 ? 0 : 0,
                                borderBottomLeftRadius: selectedTab === 6 ? 10 : 0,
                            }}
                        >
                        </div>
                    </div>
                </div>


                <div
                    style={{
                        width: "full",
                        height: 10,
                        background: 'linear-gradient(to bottom, #9da7e380, #FFFFFF)',
                        borderTopLeftRadius: 3,
                        borderTopRightRadius: 3,
                    }}
                >
                </div>
                <div className="w-full h-auto bg-white">
                    {children}
                </div>
            </div>
        </div>
    )
}

export {
    ScheduleTabs
}