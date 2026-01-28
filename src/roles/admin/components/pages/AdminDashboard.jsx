import React, { useState } from "react";
import { useOutletContext } from 'react-router-dom';
import { motion } from "framer-motion";

// --- CONTEXT IMPORTS ---
import { useDate } from "../dashboard/DatePicker";
import { useData } from "../../../../context/DataContext";       
import { useLoader } from "../../../../context/LoaderContext";   

// --- COMPONENT IMPORTS ---
import { BandedChartTADMC } from "../charts/BandedChartTADMC";
import { BandedChartCUR } from "../charts/BandedChartCUR";
import { BandedChartOCF } from "../charts/BandedChartOCF";
import { CustomStatsCard } from "../dashboard/CustomStatsCard";
import { StatsCardGroup } from "../dashboard/StatsCardGroup";
import { BarChartBox } from "../charts/BarChartBox";
import { LineChartBox } from "../charts/LineChartBox";
import { OngoingEvents } from "../dashboard/OngoingEvents";
import { EventsPanel } from "../dashboard/EventsPanel";
import { AnalyticTabs } from "../dashboard/AnalyticTabs";
import { DatePicker } from "../dashboard/DatePicker";
import { HeaderBar } from "../../../../components/global/HeaderBar";
import { Skeleton } from "../../../../components/global/Skeleton"; 

const USER_AVATAR = "https://randomuser.me/api/portraits/lego/3.jpg";

export default function AdminDashboard() {
    // 1. HOOKS
    const [selectedTab, setSelectedTab] = useState(1);
    const { selectedDate } = useDate();
    
    // 2. CONNECT TO CONTEXT
    const { isLoading } = useLoader(); 
    const { dashboardData, events, students } = useData(); 

    // 3. DATA MAPPING
    const extractedData = {
        today: dashboardData.daily || [],
        weekly: dashboardData.weekly || [],
        monthly: dashboardData.monthly || [],
        overall: dashboardData.overall || {}
    };

    // Helper: Map Tab ID to Data Key
    const getTimeframeKey = (id) => {
        switch (id) {
            case 1: return 'today';
            case 2: return 'weekly';
            case 3: return 'monthly';
            case 4: return 'overall';
            default: return 'today';
        }
    };

    // Helper: Get specific chart data safely
    const getChartData = (dataKey) => {
        if (isLoading) return []; 

        const timeKey = getTimeframeKey(selectedTab);
        const timeDataArray = extractedData[timeKey]; 

        if (!Array.isArray(timeDataArray)) return []; 

        const foundItem = timeDataArray.find(item => item[dataKey]);
        return foundItem ? foundItem[dataKey] : [];
    };

    // --- MOCKED/DERIVED DATA FOR CARDS ---
    const mealRequestData = {
        accepted: [
            { title: "Absent Students", value: 0, subtitle: "Today" },
            { title: "Waived Students", value: 0, subtitle: "Today" },
            { title: "Eligible Students", value: students?.length || 1500, subtitle: "Today" } 
        ],
        rejected: [
            { title: "Rejected Request Rate", value: 0, subtitle: "Overall", acceptanceRate: 5, expectingPositiveResult: false, isPercentage: true },
            { title: "Accepted Request Rate", value: 100, subtitle: "Overall", acceptanceRate: 95, expectingPositiveResult: true, isPercentage: true },
            
        ]
    };

    function getMetricName (selectedTab) {
        switch (selectedTab) {
            case 1: return "Today"
            break;
            case 2: return "This Week"
            break;
            case 3: return "This Month"
            break;
        }
    };

    return (
        <>
            <div
                style={{ backgroundColor: "#F7F9F9", marginBottom: "30px" }}
                className="w-full h-auto flex flex-col justify-start"
            >
                {/* HEADER */}
                <HeaderBar userAvatar={USER_AVATAR} headerTitle={"Dashboard"} />

                {/* CONTENT */}
                <div className="w-full">
                    <div
                        style={{
                            borderRadius: '10px', marginTop: '20px', marginLeft: '20px', marginRight: '20px',
                            backgroundColor: "#F7F9F9", width: "auto", display: 'grid',
                            gridTemplateColumns: '70% 30%', gap: "18px", alignItems: 'start',
                        }}
                    >

                        {/* --- LEFT COLUMN --- */}
                        <div className="w-full h-full flex flex-col gap-4">
                            <div className="grid grid-cols-6 gap-4">
                                
                                {/* CARD 1: VIRTUAL CREDIT */}
                                <motion.div
                                    key={isLoading ? "skel-credit" : "real-credit"}
                                    initial={isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ type: "spring", delay: 0 }}
                                    className="h-full col-span-2"
                                >
                                    <CustomStatsCard 
                                        title={"Daily Virtual Credit Used"} 
                                        value={"P60,000"} 
                                        subtitle={"vs P65,000 allotted"}
                                        isLoading={isLoading} 
                                    />
                                </motion.div>

                                {/* CARD 2: ELIGIBILITY LIST */}
                                <motion.div
                                    key={isLoading ? "skel-eligibility" : "real-eligibility"}
                                    initial={isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ type: "spring", delay: 0.1 }}
                                    className="col-span-4"
                                >
                                    <StatsCardGroup
                                        cardGroupTitle={"Meal Eligibilty List Count"}
                                        urgentNotification={0}
                                        isDualPager={true}
                                        dualPageTitles={["View Student Counts", "View Request Rates"]}
                                        footnote={"Data as of this current day"}
                                        primaryData={mealRequestData.accepted}
                                        secondaryData={mealRequestData.rejected}
                                        isLoading={isLoading} 
                                    />
                                </motion.div>
                            </div>

                            {/* --- TABS & CHARTS --- */}
                            <motion.div
                                key={isLoading ? "skel-tabs" : "real-tabs"}
                                initial={isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "spring", delay: 0.3 }}
                            >
                                <AnalyticTabs selectedTab={selectedTab} onTabChange={setSelectedTab}>
                                    <div className="w-[100%] flex flex-col items-center h-[100%] bg-[#FFFFFF]">

                                        {/* TAB 4: OVERALL */}
                                        {selectedTab === 4 && (
                                           <div className="flex flex-col items-center gap-4 w-full" style={{ padding: 10 }}>
                                                
                                                <div className="flex h-full w-[98%] border-gray-100 border-[1px] rounded-xl">
                                                    <StatsCardGroup 
                                                        cardGroupTitle={"Dish Combination Claims Status"} isDualPager={true} 
                                                        dualPageTitles={["View Most Claims", "View Least Claims"]}
                                                        primaryData={extractedData.overall?.mostMealClaims || []} 
                                                        secondaryData={extractedData.overall?.leastMealClaims || []}
                                                        isLoading={isLoading}
                                                        urgentNotification={0}
                                                    />
                                                </div>

                                                <div className="flex h-full w-[98%] border-gray-100 border-[1px] rounded-xl">
                                                    <StatsCardGroup 
                                                        cardGroupTitle={"Claims Count"} isDualPager={false}
                                                        primaryData={extractedData.overall?.claimsCount || []} 
                                                        isLoading={isLoading}
                                                        urgentNotification={0}
                                                    />
                                                </div>

                                                <div className="flex h-full w-[98%] border-gray-100 border-[1px] rounded-xl">
                                                    <StatsCardGroup 
                                                        cardGroupTitle={"KPI Metrics"} isDualPager={false}
                                                        primaryData={extractedData.overall?.KPIreports || []} 
                                                        isLoading={isLoading}
                                                        urgentNotification={0}
                                                    />
                                                </div>
                                                
                                                <div className="flex h-full w-[98%] border-gray-100 border-[1px] rounded-xl">
                                                    <StatsCardGroup 
                                                        cardGroupTitle={"Consumed Credits"} isDualPager={false}
                                                        primaryData={extractedData.overall?.consumedCredits || []} 
                                                        isLoading={isLoading}
                                                        urgentNotification={0}
                                                    />
                                                </div>
                                           </div>
                                        )}

                                        {/* TAB 5: DATE PICKER */}
                                        {selectedTab === 5 && (
                                            <div className="w-full">
                                                <DatePicker />
                                                {selectedDate && !isLoading && (
                                                     <div className="p-4 text-center text-gray-400 text-sm">
                                                        Data for {selectedDate.toDateString()} will appear here...
                                                     </div>
                                                )}
                                            </div>
                                        )}

                                        {/* TABS 1, 2, 3: CHARTS */}
                                        {selectedTab !== 4 && selectedTab !== 5 && (
                                            <>
                                                {/* BAR CHART SECTION */}
                                                <motion.div 
                                                    key={isLoading ? "skel-bar" : "real-bar"}
                                                    initial={isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ type: "spring", delay: 0 }}
                                                    className="flex h-full w-[98%] border-[#D9D9D9] border-[1px]" 
                                                    style={{ marginTop: 10, marginBottom: 10, borderRadius: 10 }}
                                                >
                                                    <div className="w-[30%] h-auto flex items-center justify-center" style={{ padding: 10 }}>
                                                        <CustomStatsCard 
                                                            title={`Dish Claims ${getMetricName(selectedTab)}`} value={100} subtitle={selectedTab === 1 ? "Today's Meal: Adobo" : "Successful Meal Claims"} 
                                                            isLoading={isLoading}
                                                            hoverText={"The total number of dish claims made by students today."}

                                                        />
                                                    </div>
                                                    <div className="h-[100%] w-[75%] flex justify-end items-center p-4">
                                                        {isLoading ? (
                                                            <Skeleton className="w-full h-[200px] rounded-lg" />
                                                        ) : (
                                                            <BarChartBox data={getChartData('barChartData')} />
                                                        )}
                                                    </div>
                                                </motion.div>

                                                {/* TRENDS (LINE) CHART */}
                                                <motion.div 
                                                    key={isLoading ? "skel-line" : "real-line"}
                                                    initial={isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ type: "spring", delay: 0.1 }}
                                                    className="flex h-[270px] w-[98%] border-[#D9D9D9] border-[1px]" 
                                                    style={{ marginBottom: 10, borderRadius: 10 }}
                                                >
                                                    <div className="w-[30%] h-auto flex items-center justify-center" style={{ padding: 10 }}>
                                                        <CustomStatsCard 
                                                            title={`Unclaim Count ${getMetricName(selectedTab)}`} value={100} 
                                                            isLoading={isLoading}
                                                            hoverText={"The total number of dish that haven't claimed today"}
                                                        />
                                                    </div>
                                                    <div className="h-[100%] w-[75%] flex justify-end items-center p-4">
                                                        {isLoading ? (
                                                            <Skeleton className="w-full h-full rounded-lg" />
                                                        ) : (
                                                            <LineChartBox data={getChartData('trendsData')} />
                                                        )}
                                                    </div>
                                                </motion.div>

                                                {/* TADMC CHART */}
                                                <motion.div 
                                                    key={isLoading ? "skel-tadmc" : "real-tadmc"}
                                                    initial={isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ type: "spring", delay: 0.2 }}
                                                    className="flex h-full w-[98%] border-[#D9D9D9] border-[1px]" 
                                                    style={{ marginBottom: 10, borderRadius: 10 }}
                                                >
                                                    <div className="w-[30%] h-auto flex items-center justify-center" style={{ padding: 10 }}>
                                                        <CustomStatsCard 
                                                            title={"Average Student Spending"} value={61} subtitle={getMetricName(selectedTab)} isPeso={true} isHasAcceptableRange={true} acceptableRate={[58, 62]} 
                                                            isLoading={isLoading}
                                                            hoverText={"Measures how much money is actually spent on a meal when a student makes a claim, combining the school’s subsidy (credit) and student’s out-of-pocket spending (excess)."}
                                                        />
                                                    </div>
                                                    <div className="h-[100%] w-[75%] flex justify-end items-center p-4">
                                                        {isLoading ? (
                                                            <Skeleton className="w-full h-[200px] rounded-lg" />
                                                        ) : (
                                                            <BandedChartTADMC data={getChartData('TADMCdata')} />
                                                        )}
                                                    </div>
                                                </motion.div>

                                                {/* CUR CHART */}
                                                <motion.div 
                                                    key={isLoading ? "skel-cur" : "real-cur"}
                                                    initial={isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ type: "spring", delay: 0.3 }}
                                                    className="flex h-full w-[98%] border-[#D9D9D9] border-[1px]" 
                                                    style={{ marginBottom: 10, borderRadius: 10 }}
                                                >
                                                    <div className="w-[30%] h-auto flex items-center justify-center" style={{ padding: 10 }}>
                                                        <CustomStatsCard 
                                                            title={"Credit Utilization Rate"} value={95} subtitle={getMetricName(selectedTab)} isPercentage={true} isHasAcceptableRange={true} acceptableRate={[90, 100]}
                                                            isLoading={isLoading}
                                                            hoverText={"The percentage of the total allocated credit budget that is actually consumed by the students before the unused amount is automatically removed."}
                                                        />
                                                    </div>
                                                    <div className="h-[100%] w-[75%] flex justify-end items-center p-4">
                                                        {isLoading ? (
                                                            <Skeleton className="w-full h-[200px] rounded-lg" />
                                                        ) : (
                                                            <BandedChartCUR data={getChartData('CURdata')} />
                                                        )}
                                                    </div>
                                                </motion.div>

                                                {/* OCF CHART */}
                                                <motion.div 
                                                    key={isLoading ? "skel-ocf" : "real-ocf"}
                                                    initial={isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ type: "spring", delay: 0.4 }}
                                                    className="flex h-full w-[98%] border-[#D9D9D9] border-[1px]" 
                                                    style={{ marginBottom: 10, borderRadius: 10 }}
                                                >
                                                    <div className="w-[30%] h-auto flex items-center justify-center" style={{ padding: 10 }}>
                                                        <CustomStatsCard 
                                                            title={"Overclaim Frequency"} value={7} subtitle={getMetricName(selectedTab)} isPercentage={true} isHasAcceptableRange={true} acceptableRate={[0, 15]}
                                                            isLoading={isLoading}
                                                            hoverText={"The frequency at which students’ total food item cost exceed the assigned credit value"}
                                                        />
                                                    </div>
                                                    <div className="h-[100%] w-[75%] flex justify-end items-center p-4">
                                                        {isLoading ? (
                                                            <Skeleton className="w-full h-[200px] rounded-lg" />
                                                        ) : (
                                                            <BandedChartOCF data={getChartData('OCFdata')} />
                                                        )}
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </div>
                                </AnalyticTabs>
                            </motion.div>
                        </div>

                        {/* --- RIGHT COLUMN --- */}
                        <div
                            style={{ position: 'sticky', top: '35px', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: "18px", alignSelf: 'start' }}
                        >
                            <motion.div
                                key={isLoading ? "skel-ongoing" : "real-ongoing"}
                                initial={isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0.5 }}
                                transition={{ type: "spring", delay: 0 }}
                            >
                                <OngoingEvents 
                                    events={events[1] || []} 
                                    isLoading={isLoading} 
                                />
                            </motion.div>
                            <motion.div
                                key={isLoading ? "skel-upcoming" : "real-upcoming"}
                                initial={isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0.6 }}
                                transition={{ type: "spring", delay: 0 }}
                            >
                                <EventsPanel 
                                    events={events[0] || []} 
                                    isLoading={isLoading} 
                                />
                            </motion.div>
                        </div>

                    </div>
                </div >
            </div >
        </>
    );
}