import { useState } from "react"

function AnalyticTabs() {
    const [selectedTab, setSelectedTab] = useState(1);

    return (
        <>
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
                        <div className="w-3 bg-[#9da7e380]">
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
                                backgroundColor: selectedTab === 1 ? "#9da7e380" : "#f8fafaff"
                            }}
                            onClick={() => { setSelectedTab(1) }}
                        >
                            Daily
                        </button>
                        <div className="w-3 bg-[#9da7e380]">
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
                                backgroundColor: selectedTab === 2 ? "#9da7e380" : "#f8fafaff"
                            }}
                            onClick={() => { setSelectedTab(2) }}
                        >
                            Weekly
                        </button>
                        <div className="w-3 bg-[#9da7e380]">
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
                                backgroundColor: selectedTab === 3 ? "#9da7e380" : "#f8fafaff"
                            }}
                            onClick={() => { setSelectedTab(3) }}
                        >
                            Monthly
                        </button>
                        <div className="w-3 bg-[#9da7e380]">
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
                                backgroundColor: selectedTab === 4 ? "#9da7e380" : "#f8fafaff"
                            }}
                            onClick={() => { setSelectedTab(4) }}
                        >
                            Overall
                        </button>
                        <div className="w-3 bg-[#9da7e380]">
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
                                backgroundColor: selectedTab === 5 ? "#9da7e380" : "#f8fafaff"
                            }}
                            onClick={() => { setSelectedTab(5) }}
                        >
                            Select a date
                        </button>
                        <div className="w-3 bg-[#9da7e380]">
                            <div
                                className=" h-full w-full bg-[#F7F9F9]"
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
                            background: 'linear-gradient(to bottom, #9da7e380, #FFFFFF)',
                            borderTopLeftRadius: 3,
                            borderTopRightRadius: 3,
                        }}
                    >
                    </div>
                    <div className="w-full h-auto bg-[#FFFFFF]">
                        some content
                    </div>
                </div>
            </div>
        </>
    )
}

export {
    AnalyticTabs
}