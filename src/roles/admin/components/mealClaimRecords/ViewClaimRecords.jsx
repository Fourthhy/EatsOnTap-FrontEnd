import { useState } from "react";
import { HeaderBar } from "../../../../components/global/HeaderBar";
import { motion, AnimatePresence } from "framer-motion";

// IMPORTS 
import { DailyClaimRecord } from "./pages/DailyClaimRecord";
import { OverallClaimRecord } from "./pages/OverallClaimRecord";
import { EligibleSections } from "./pages/EligibleSections"; 

function ViewClaimRecords() {
    const USER_AVATAR = "https://randomuser.me/api/portraits/lego/3.jpg";
    
    // Options: 'eligible', 'daily' (detail view), 'overall'
    const [view, setView] = useState("eligible"); 
    
    // 🟢 New State: Store the section data when drilling down
    const [selectedSection, setSelectedSection] = useState(null);

    // 🟢 Updated Switcher Logic
    const switchView = (targetView, data = null) => {
        if (targetView === 'daily' && data) {
            // Entering Detail View
            setSelectedSection(data);
        } else {
            // Going back or switching tabs (clear selection)
            setSelectedSection(null);
        }
        setView(targetView);
    }

    // Animation Variants
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
                        
                        <AnimatePresence mode="wait">
                            {/* MASTER VIEW: List of Sections */}
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

                            {/* DETAIL VIEW: Specific Section Record */}
                            {view === "daily" && (
                                <motion.div 
                                    key="daily"
                                    {...pageVariants}
                                    style={{ width: '100%' }}
                                >
                                    <DailyClaimRecord 
                                        currentView={view} 
                                        switchView={switchView}
                                        // 🟢 Pass the selected data down
                                        sectionData={selectedSection}
                                    />
                                </motion.div>
                            )}

                            {/* ANALYTICS VIEW */}
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