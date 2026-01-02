import { useState } from "react";
import { HeaderBar } from "../../../../components/global/HeaderBar";
import { motion, AnimatePresence } from "framer-motion"; // 🟢 Import Motion

// IMPORTS 
import { DailyClaimRecord } from "./pages/DailyClaimRecord";
import { OverallClaimRecord } from "./pages/OverallClaimRecord";
import { EligibleSections } from "./pages/EligibleSections"; 

function ViewClaimRecords() {
    const USER_AVATAR = "https://randomuser.me/api/portraits/lego/3.jpg";
    
    // Options: 'eligible', 'daily', 'overall'
    const [view, setView] = useState("daily"); 

    const switchView = (targetView) => {
        setView(targetView);
    }

    // 🟢 Animation Variants for consistency
    const pageVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.2 }
    };

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
                    <div className="w-[98%]">
                        
                        {/* 🟢 AnimatePresence with mode='wait' prevents layout jumps */}
                        <AnimatePresence mode="wait">
                            {view === "eligible" && (
                                <motion.div 
                                    key="eligible"
                                    {...pageVariants}
                                    style={{ width: '100%' }}
                                >
                                    <EligibleSections 
                                        currentView={view} 
                                        switchView={switchView} 
                                    />
                                </motion.div>
                            )}

                            {view === "daily" && (
                                <motion.div 
                                    key="daily"
                                    {...pageVariants}
                                    style={{ width: '100%' }}
                                >
                                    <DailyClaimRecord 
                                        currentView={view} 
                                        switchView={switchView} 
                                    />
                                </motion.div>
                            )}

                            {view === "overall" && (
                                <motion.div 
                                    key="overall"
                                    {...pageVariants}
                                    style={{ width: '100%' }}
                                >
                                    <OverallClaimRecord 
                                        currentView={view} 
                                        switchView={switchView} 
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </div>
            </div>
        </>
    )
}

export { ViewClaimRecords }