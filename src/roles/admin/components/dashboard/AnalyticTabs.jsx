function AnalyticTabs({ children, selectedTab, onTabChange }) {
    return (
        <div>
            <div className="w-full bg-[#F7F9F9]">
                <div style={{ marginBottom: 5 }}>
                    <span
                        style={{
                            fontWeight: "500",
                            fontSize: 14,
                            color: "#000000",
                            fontFamily: "geist",
                            width: "fit-content",
                            height: "fit-content",
                        }}
                    >
                        Analytic Reports
                    </span>
                </div>

                <div className="flex">
                    <div className="w-3 bg-[#2CA4DD3f]">
                        <div
                            className=" h-full w-full bg-[#F7F9F9]"
                            style={{ borderBottomRightRadius: selectedTab === 1 ? 10 : 0 }}
                        >
                        </div>
                    </div>
                    <button
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 50px",
                            cursor: "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                            
                            backgroundColor: selectedTab === 1 ? "#2CA4DD3f" : "#FFFFFF"
                        }}
                        onClick={() => onTabChange(1)}
                    >
                        Daily
                    </button>
                    <div className="w-3 bg-[#2CA4DD3f]">
                        <div
                            className=" h-full w-full bg-[#F7F9F9]"
                            style={{
                                borderBottomRightRadius: selectedTab === 1 ? 0 : selectedTab === 2 ? 10 : 0,
                                borderBottomLeftRadius: selectedTab === 1 ? 10 : 0,
                            }}
                        >
                        </div>
                    </div>
                    <button
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 50px",
                            cursor: "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                            
                            backgroundColor: selectedTab === 2 ? "#2CA4DD3f" : "#FFFFFF"
                        }}
                        onClick={() => onTabChange(2)}
                    >
                        Weekly
                    </button>
                    <div className="w-3 bg-[#2CA4DD3f]">
                        <div
                            className=" h-full w-full bg-[#F7F9F9]"
                            style={{
                                borderBottomRightRadius: selectedTab === 2 ? 0 : selectedTab === 3 ? 10 : 0,
                                borderBottomLeftRadius: selectedTab === 2 ? 10 : 0,
                            }}
                        >
                        </div>
                    </div>
                    <button
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 50px",
                            cursor: "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                            
                            backgroundColor: selectedTab === 3 ? "#2CA4DD3f" : "#FFFFFF"
                        }}
                        onClick={() => onTabChange(3)}
                    >
                        Monthly
                    </button>
                    <div className="w-3 bg-[#2CA4DD3f]">
                        <div
                            className=" h-full w-full bg-[#F7F9F9]"
                            style={{
                                borderBottomRightRadius: selectedTab === 3 ? 0 : selectedTab === 4 ? 10 : 0,
                                borderBottomLeftRadius: selectedTab === 3 ? 10 : 0,
                            }}
                        >
                        </div>
                    </div>
                    <button
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 50px",
                            cursor: "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                            
                            backgroundColor: selectedTab === 4 ? "#2CA4DD3f" : "#FFFFFF"
                        }}
                        onClick={() => onTabChange(4)}
                    >
                        Overall
                    </button>
                    <div className="w-3 bg-[#2CA4DD3f]">
                        <div
                            className=" h-full w-full bg-[#F7F9F9]"
                            style={{
                                borderBottomRightRadius: selectedTab === 4 ? 0 : selectedTab === 5 ? 10 : 0,
                                borderBottomLeftRadius: selectedTab === 4 ? 10 : 0,
                            }}
                        >
                        </div>
                    </div>
                    <button
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 50px",
                            cursor: "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                            
                            backgroundColor: selectedTab === 5 ? "#2CA4DD3f" : "#FFFFFF"
                        }}
                        onClick={() => onTabChange(5)}
                    >
                        Specific Date
                    </button>
                    <div className="w-3 bg-[#2CA4DD3f]">
                        <div
                            className=" h-full w-full bg-[#F7F9F9] border-none"
                            style={{
                                borderBottomRightRadius: selectedTab === 5 ? 0 : selectedTab === 5 ? 10 : 0,
                                borderBottomLeftRadius: selectedTab === 5 ? 10 : 0,
                            }}
                        >
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        width: "full",
                        height: 10,
                        background: 'linear-gradient(to bottom, #2CA4DD3f, #FFFFFF)',
                        borderTopLeftRadius: 3,
                        borderTopRightRadius: 3,
                    }}
                >
                </div>

                {children}
            </div>
        </div>
    )
}

export {
    AnalyticTabs
}