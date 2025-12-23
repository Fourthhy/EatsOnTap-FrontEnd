import { GoKebabHorizontal } from "react-icons/go";
import { PiExport } from "react-icons/pi";
import { ClipboardMinus } from "lucide-react";
import { Tooltip } from "flowbite-react";

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

                {/* Added w-full to the parent container */}
                <div className="flex w-full">
                    <div className="w-3 bg-[#4268BD]">
                        <div
                            className="h-full w-full bg-[#F7F9F9] transition-all duration-200 ease-in-out"
                            style={{ borderBottomRightRadius: selectedTab === 1 ? 10 : 0 }}
                        ></div>
                    </div>

                    {/* Added flex-1 to each tab button. Removed horizontal padding (50px) to allow flex to control width */}
                    <button
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 0", // Changed from 10px 50px to allow flex-1 to work
                            cursor: "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                        }}
                        className={`flex-1 ${selectedTab === 1 ? "bg-[#4268BD] text-[#EEEEEE]" : "bg-[#FFFFFF] hover:bg-slate-200"} transition-colors duration-200`}
                        onClick={() => onTabChange(1)}
                    >
                        Daily
                    </button>

                    <div className="w-3 bg-[#4268BD]">
                        <div
                            className="h-full w-full bg-[#F7F9F9] transition-all duration-200 ease-in-out"
                            style={{
                                borderBottomRightRadius: selectedTab === 1 ? 0 : selectedTab === 2 ? 10 : 0,
                                borderBottomLeftRadius: selectedTab === 1 ? 10 : 0,
                            }}
                        ></div>
                    </div>

                    <button
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 0",
                            cursor: "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                        }}
                        className={`flex-1 ${selectedTab === 2 ? "bg-[#4268BD] text-[#EEEEEE]" : "bg-[#FFFFFF] hover:bg-slate-200"} transition-colors duration-200`}
                        onClick={() => onTabChange(2)}
                    >
                        Weekly
                    </button>

                    <div className="w-3 bg-[#4268BD]">
                        <div
                            className="h-full w-full bg-[#F7F9F9] transition-all duration-200 ease-in-out"
                            style={{
                                borderBottomRightRadius: selectedTab === 2 ? 0 : selectedTab === 3 ? 10 : 0,
                                borderBottomLeftRadius: selectedTab === 2 ? 10 : 0,
                            }}
                        ></div>
                    </div>

                    <button
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 0",
                            cursor: "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                        }}
                        className={`flex-1 ${selectedTab === 3 ? "bg-[#4268BD] text-[#EEEEEE]" : "bg-[#FFFFFF] hover:bg-slate-200"} transition-colors duration-200`}
                        onClick={() => onTabChange(3)}
                    >
                        Monthly
                    </button>

                    <div className="w-3 bg-[#4268BD]">
                        <div
                            className="h-full w-full bg-[#F7F9F9]"
                            style={{
                                borderBottomRightRadius: selectedTab === 3 ? 0 : selectedTab === 4 ? 10 : 0,
                                borderBottomLeftRadius: selectedTab === 3 ? 10 : 0,
                            }}
                        ></div>
                    </div>

                    <button
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 0",
                            cursor: "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                        }}
                        className={`flex-1 ${selectedTab === 4 ? "bg-[#4268BD] text-[#EEEEEE]" : "bg-[#FFFFFF] hover:bg-slate-200"} transition-colors duration-200`}
                        onClick={() => onTabChange(4)}
                    >
                        Overall
                    </button>

                    <div className="w-3 bg-[#4268BD]">
                        <div
                            className="h-full w-full bg-[#F7F9F9] transition-all duration-200 ease-in-out"
                            style={{
                                borderBottomRightRadius: selectedTab === 4 ? 0 : selectedTab === 5 ? 10 : 0,
                                borderBottomLeftRadius: selectedTab === 4 ? 10 : 0,
                            }}
                        ></div>
                    </div>

                    <button
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 0",
                            cursor: "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                        }}
                        className={`flex-1 ${selectedTab === 5 ? "bg-[#4268BD] text-[#EEEEEE]" : "bg-[#FFFFFF] hover:bg-slate-200"} transition-colors duration-200`}
                        onClick={() => onTabChange(5)}
                    >
                        Specific Date
                    </button>

                    <div className="w-3 bg-[#4268BD]">
                        <div
                            className="h-full w-full bg-[#F7F9F9] transition-all duration-200 ease-in-out"
                            style={{
                                borderBottomRightRadius: selectedTab === 5 ? 0 : 0,
                                borderBottomLeftRadius: selectedTab === 5 ? 10 : 0,
                            }}
                        ></div>
                    </div>

                    {/* The Export button keeps its fixed width (padding: 10px 20px) so it doesn't stretch like the tabs */}
                    <Tooltip
                        content={<p className="font-geist w-[120px] text-center" style={{ padding: "10px" }}>Export Reports</p>}
                        placement="top"
                        trigger="hover"
                        style="light"
                        arrow={false}
                    >
                        <button
                            style={{
                                borderTopLeftRadius: 6,
                                borderTopRightRadius: 6,
                                padding: "10px 20px",
                                cursor: "pointer",
                                fontFamily: "geist",
                                fontSize: 12,
                                fontWeight: 500,
                            }}
                            className="bg-[#FFFFFF] hover:bg-slate-200 transition-colors duration-200"
                            onClick={() => { alert("export report") }}
                        >
                            <PiExport size={20} />
                        </button>
                    </Tooltip>
                </div>
                <div
                    style={{
                        width: "full",
                        height: 10,
                        background: 'linear-gradient(to bottom, #4268BD, #FFFFFF)',
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