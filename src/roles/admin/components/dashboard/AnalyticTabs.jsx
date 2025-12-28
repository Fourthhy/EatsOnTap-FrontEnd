import React, { useState } from 'react'; 
import { PiExport } from "react-icons/pi";
import { Tooltip } from "flowbite-react";
import { ExportReportModal } from './ExportReportModal'; 

// 1. IMPORT SKELETON & LOADER CONTEXT
import { Skeleton } from "../../../../components/global/Skeleton";
import { useLoader } from "../../../../context/LoaderContext"; // Helper to get loading state directly if not passed

function AnalyticTabs({ children, selectedTab, onTabChange }) {
    // 2. GET LOADING STATE (Or rely on prop if you prefer passing it down)
    const { isLoading } = useLoader(); 
    
    // --- STATE FOR MODAL ---
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    // --- HELPER: Renders Skeletons instead of Buttons ---
    if (isLoading) {
        return (
            <div>
                <div className="w-full bg-[#F7F9F9]">
                    <div style={{ marginBottom: 5 }}>
                        <Skeleton className="h-5 w-32 rounded mb-2" />
                    </div>

                    <div className="flex w-full items-end gap-1">
                        {/* Render 5 Skeleton Tabs + 1 Export Button */}
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex-1">
                                <Skeleton className="h-10 w-full rounded-t-md" />
                            </div>
                        ))}
                         <div style={{ width: 60 }}>
                                <Skeleton className="h-10 w-full rounded-t-md" />
                        </div>
                    </div>
                    
                    <div
                        style={{
                            width: "full",
                            height: 10,
                            // Use a grey gradient or solid grey for skeleton state
                            background: '#e5e7eb', 
                            borderTopLeftRadius: 3,
                            borderTopRightRadius: 3,
                        }}
                    />

                    {/* Pass children through - The parent Dashboard handles content skeletons */}
                    {children}
                </div>
            </div>
        );
    }

    // --- REAL RENDER (UNCHANGED LOGIC) ---
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

                <div className="flex w-full">
                    {/* --- TAB 1: DAILY --- */}
                    <div className="w-3 bg-[#4268BD]">
                        <div
                            className="h-full w-full bg-[#F7F9F9] transition-all duration-200 ease-in-out"
                            style={{ borderBottomRightRadius: selectedTab === 1 ? 10 : 0 }}
                        ></div>
                    </div>

                    <button
                        style={{
                            borderTopLeftRadius: 6, borderTopRightRadius: 6, padding: "10px 0",
                            cursor: "pointer", fontFamily: "geist", fontSize: 12, fontWeight: 500,
                        }}
                        className={`flex-1 ${selectedTab === 1 ? "bg-[#4268BD] text-[#EEEEEE]" : "bg-[#FFFFFF] hover:bg-slate-200"} transition-colors duration-200`}
                        onClick={() => onTabChange(1)}
                    >
                        Daily
                    </button>

                    {/* --- TAB 2: WEEKLY --- */}
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
                            borderTopLeftRadius: 6, borderTopRightRadius: 6, padding: "10px 0",
                            cursor: "pointer", fontFamily: "geist", fontSize: 12, fontWeight: 500,
                        }}
                        className={`flex-1 ${selectedTab === 2 ? "bg-[#4268BD] text-[#EEEEEE]" : "bg-[#FFFFFF] hover:bg-slate-200"} transition-colors duration-200`}
                        onClick={() => onTabChange(2)}
                    >
                        Weekly
                    </button>

                    {/* --- TAB 3: MONTHLY --- */}
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
                            borderTopLeftRadius: 6, borderTopRightRadius: 6, padding: "10px 0",
                            cursor: "pointer", fontFamily: "geist", fontSize: 12, fontWeight: 500,
                        }}
                        className={`flex-1 ${selectedTab === 3 ? "bg-[#4268BD] text-[#EEEEEE]" : "bg-[#FFFFFF] hover:bg-slate-200"} transition-colors duration-200`}
                        onClick={() => onTabChange(3)}
                    >
                        Monthly
                    </button>

                    {/* --- TAB 4: OVERALL --- */}
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
                            borderTopLeftRadius: 6, borderTopRightRadius: 6, padding: "10px 0",
                            cursor: "pointer", fontFamily: "geist", fontSize: 12, fontWeight: 500,
                        }}
                        className={`flex-1 ${selectedTab === 4 ? "bg-[#4268BD] text-[#EEEEEE]" : "bg-[#FFFFFF] hover:bg-slate-200"} transition-colors duration-200`}
                        onClick={() => onTabChange(4)}
                    >
                        Overall
                    </button>

                    {/* --- TAB 5: SPECIFIC DATE --- */}
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
                            borderTopLeftRadius: 6, borderTopRightRadius: 6, padding: "10px 0",
                            cursor: "pointer", fontFamily: "geist", fontSize: 12, fontWeight: 500,
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

                    {/* --- EXPORT BUTTON --- */}
                    <Tooltip
                        content={<p className="font-geist w-[120px] text-center" style={{ padding: "10px" }}>Export Reports</p>}
                        placement="top"
                        trigger="hover"
                        style="light"
                        arrow={false}
                    >
                        <button
                            style={{
                                borderTopLeftRadius: 6, borderTopRightRadius: 6, padding: "10px 20px",
                                cursor: "pointer", fontFamily: "geist", fontSize: 12, fontWeight: 500,
                            }}
                            className="bg-[#FFFFFF] hover:bg-slate-200 transition-colors duration-200"
                            onClick={() => setIsExportModalOpen(true)}
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

                <ExportReportModal 
                    isOpen={isExportModalOpen} 
                    onClose={() => setIsExportModalOpen(false)} 
                />
            </div>
        </div>
    )
}

export {
    AnalyticTabs
}