import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from "framer-motion"; // 🟢 Import Framer Motion

// --- COMPONENTS ---
import { StatsCardGroup } from '../../../admin/components/dashboard/StatsCardGroup';
import { EventsPanel } from '../../../admin/components/dashboard/EventsPanel';

import { ProgramsList } from '../ProgramsList';
import { ScheduleTabs } from '../ScheduleTabs';

import { OngoingEvents } from '../../../admin/components/dashboard/OngoingEvents';
import { HeaderBar } from "../../../../components/global/HeaderBar";
import { Skeleton } from "../../../../components/global/Skeleton"; // 🟢 Import Skeleton

// --- CONTEXT ---
import { useData } from "../../../../context/DataContext";

// 🟢 ANIMATION VARIANTS
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Stagger effect for children
            when: "beforeChildren"
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 50, damping: 15 }
    }
};

export default function AdminAssistantDashboard() {
    const { events } = useData();
    const [isLoading, setIsLoading] = useState(true);

    // 🟢 TRIGGER LOADING ONLY ONCE ON MOUNT
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const context = useOutletContext() || {};
    const handleToggleSidebar = context.handleToggleSidebar || (() => { });
    const USER_AVATAR = "https://randomuser.me/api/portraits/lego/3.jpg";

    const date = new Date();
    const dayIndex = date.getDay(); // 0-6 (Sun-Sat)
    // Adjust logic if your tabs (1-6) map differently to dayIndex
    const [selectedTab, setSelectedTab] = useState(dayIndex === 0 ? 1 : dayIndex); 

    const higherEducationMealClaimStatus = [
        { title: "Meal Claims", value: 1200, subtitle: "80% of total alotted" },
        { title: "Meal Unclaims", value: 300, subtitle: "20% of total alotted" },
        { title: "Total Alotted Meals", value: 1500, subtitle: "Today" },
    ];

    return (
        <>
            <div
                style={{
                    backgroundColor: "#F7F9F9",
                    marginBottom: "30px"
                }}
                className="w-full h-auto flex flex-col justify-start"
            >

                {/* HEADER */}
                <HeaderBar userAvatar={USER_AVATAR} headerTitle={"Dashboard"} />

                {/* CONTENT */}
                <div className="h-full w-full">
                    
                    {/* 🟢 MAIN GRID CONTAINER */}
                    <motion.div
                        style={{
                            borderRadius: '10px',
                            marginTop: '20px',
                            marginLeft: '40px',
                            marginRight: '40px',
                            backgroundColor: "#F7F9F9"
                        }}
                        className="w-auto bg-white grid grid-cols-[70%_30%] gap-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >

                        {/* LEFT COLUMN */}
                        <div className="w-full h-auto flex flex-col gap-4">

                            {/* 🟢 PASS ISLOADING TO TABS */}
                            <ScheduleTabs
                                selectedTab={selectedTab}
                                onTabChange={setSelectedTab}
                                isLoading={isLoading} 
                            >
                                <div style={{ marginTop: 10 }} className="w-full flex flex-col items-center">
                                    <div className="w-[98%]">

                                        {/* STATS SECTION */}
                                        {isLoading ? (
                                            <div className="grid grid-cols-3 gap-4 mb-6">
                                                <Skeleton className="h-32 w-full rounded-xl" />
                                                <Skeleton className="h-32 w-full rounded-xl" />
                                                <Skeleton className="h-32 w-full rounded-xl" />
                                            </div>
                                        ) : (
                                            <motion.div variants={itemVariants}>
                                                <StatsCardGroup
                                                    cardGroupTitle={"Claim Status"}
                                                    isDualPager={false}
                                                    urgentNotification={0}
                                                    primaryData={higherEducationMealClaimStatus}
                                                    displayDate={true}
                                                    footnote={"That report contains from the collection of schedled programs and years listed below"}
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                {/* PROGRAMS LIST SECTION */}
                                {isLoading ? (
                                    <div className="w-full flex flex-col gap-3 px-4 mt-4">
                                        <Skeleton className="h-12 w-full rounded-md" />
                                        <Skeleton className="h-12 w-full rounded-md" />
                                        <Skeleton className="h-12 w-full rounded-md" />
                                        <Skeleton className="h-12 w-full rounded-md" />
                                    </div>
                                ) : (
                                    <motion.div variants={itemVariants}>
                                        <ProgramsList />
                                    </motion.div>
                                )}
                            </ScheduleTabs>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="w-full h-auto flex flex-col gap-4">

                            {/* ONGOING EVENTS SECTION */}
                            <div>
                                {isLoading ? (
                                    <Skeleton className="w-full h-64 rounded-xl shadow-sm" />
                                ) : (
                                    <motion.div variants={itemVariants}>
                                        <OngoingEvents events={events[1] || []} />
                                    </motion.div>
                                )}
                            </div>

                            {/* EVENTS PANEL SECTION */}
                            <div>
                                {isLoading ? (
                                    <Skeleton className="w-full h-96 rounded-xl shadow-sm" />
                                ) : (
                                    <motion.div variants={itemVariants}>
                                        <EventsPanel events={events[0] || []} />
                                    </motion.div>
                                )}
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </>
    );
}