import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Skeleton } from "../../../components/global/Skeleton";

function ScheduleTabs({ children, selectedTab, onTabChange }) {
    
    // 🟢 1. Declare Local Loading State
    const [isLoading, setIsLoading] = useState(true);

    // 🟢 2. Effect to turn off loading after 2 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // Helper to render tab content or skeleton
    const renderTabLabel = (label) => {
        if (isLoading) {
            return <Skeleton className="h-3 w-16 mx-auto rounded-sm opacity-50" />;
        }
        return label;
    };

    // Animation variants for tab content switching
    const contentVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };

    return (
        <div>
            <div className="w-full bg-white">
                <div style={{ paddingBottom: 20 }} className="flex flex-col bg-[#F7F9F9]">
                    
                    {/* 🟢 TITLE SECTION WITH SKELETON */}
                    <div style={{ paddingLeft: 15, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {isLoading ? (
                            <div className="flex flex-col gap-2 mt-2">
                                <Skeleton className="h-8 w-48 rounded-md" />
                                <Skeleton className="h-4 w-64 rounded-md opacity-70" />
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                transition={{ duration: 0.5 }}
                            >
                                <div
                                    style={{
                                        fontWeight: "500",
                                        fontSize: 20,
                                        color: "#000000",
                                        fontFamily: "geist",
                                        width: "fit-content",
                                        height: "fit-content",
                                    }}
                                >
                                    Eligible Programs
                                </div>
                                <div
                                    style={{
                                        fontWeight: "450",
                                        fontSize: 13,
                                        color: "#2D2D2D",
                                        fontFamily: "geist",
                                        width: "fit-content",
                                        height: "fit-content",
                                    }}
                                >
                                    For Higher Education Students
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* TABS HEADER */}
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
                        className="flex-1 min-w-0"
                        disabled={isLoading}
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 0",
                            cursor: isLoading ? "default" : "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                            boxShadow: "2px 0 5px #e5eaf0",
                            backgroundColor: selectedTab === 1 ? "#9da7e380" : "#FFFFFF",
                            transition: "background-color 0.2s ease"
                        }}
                        onClick={() => onTabChange(1)}
                    >
                        {renderTabLabel("Monday")}
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
                        disabled={isLoading}
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 0",
                            cursor: isLoading ? "default" : "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                            boxShadow: "2px 0 5px #e5eaf0",
                            backgroundColor: selectedTab === 2 ? "#9da7e380" : "#FFFFFF",
                            transition: "background-color 0.2s ease"
                        }}
                        onClick={() => onTabChange(2)}
                    >
                        {renderTabLabel("Tuesday")}
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
                        disabled={isLoading}
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 0",
                            cursor: isLoading ? "default" : "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                            boxShadow: "2px 0 5px #e5eaf0",
                            backgroundColor: selectedTab === 3 ? "#9da7e380" : "#FFFFFF",
                            transition: "background-color 0.2s ease"
                        }}
                        onClick={() => onTabChange(3)}
                    >
                        {renderTabLabel("Wednesday")}
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
                        disabled={isLoading}
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 0",
                            cursor: isLoading ? "default" : "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                            boxShadow: "2px 0 5px #e5eaf0",
                            backgroundColor: selectedTab === 4 ? "#9da7e380" : "#FFFFFF",
                            transition: "background-color 0.2s ease"
                        }}
                        onClick={() => onTabChange(4)}
                    >
                        {renderTabLabel("Thursday")}
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
                        disabled={isLoading}
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 0",
                            cursor: isLoading ? "default" : "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                            boxShadow: "2px 0 5px #e5eaf0",
                            backgroundColor: selectedTab === 5 ? "#9da7e380" : "#FFFFFF",
                            transition: "background-color 0.2s ease"
                        }}
                        onClick={() => onTabChange(5)}
                    >
                        {renderTabLabel("Friday")}
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
                        disabled={isLoading}
                        style={{
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            padding: "10px 0",
                            cursor: isLoading ? "default" : "pointer",
                            fontFamily: "geist",
                            fontSize: 12,
                            fontWeight: 500,
                            boxShadow: "2px 0 5px #e5eaf0",
                            backgroundColor: selectedTab === 6 ? "#9da7e380" : "#FFFFFF",
                            transition: "background-color 0.2s ease"
                        }}
                        onClick={() => onTabChange(6)}
                    >
                        {renderTabLabel("Saturday")}
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

                {/* GRADIENT BORDER */}
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

                {/* 🟢 TAB CONTENT WITH ANIMATION */}
                <div className="w-full h-auto bg-white">
                    <AnimatePresence mode="wait">
                        {!isLoading && (
                            <motion.div
                                key={selectedTab} // Unmounts and remounts when tab changes
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                {children}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export {
    ScheduleTabs
}