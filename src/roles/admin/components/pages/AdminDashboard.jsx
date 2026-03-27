import React, { useState, useMemo } from "react"; // 🟢 Added useMemo
import { motion } from "framer-motion";

// --- CONTEXT IMPORTS ---
import { useDate } from "../dashboard/DatePicker";
import { useData } from "../../../../context/DataContext";
import { useLoader } from "../../../../context/LoaderContext";

// --- COMPONENT IMPORTS ---
import { BandedChartTADMC } from "../charts/BandedChartTADMC";
import { BandedChartCUR } from "../charts/BandedChartCUR";
import { BandedChartOCF } from "../charts/BandedChartOCF";

import { DailyExpensesChart } from "../charts/DailyExpensesChart";
import { CustomStatsCard } from "../dashboard/CustomStatsCard";
import { StatsCardGroup } from "../dashboard/StatsCardGroup";
import { BarChartBox } from "../charts/BarChartBox";
import { LineChartBox } from "../charts/LineChartBox";
import { OngoingEvents } from "../dashboard/OngoingEvents";
import { EventsPanel } from "../dashboard/EventsPanel";
import { AnalyticTabs } from "../dashboard/AnalyticTabs";
import { HeaderBar } from "../../../../components/global/HeaderBar";
import { Skeleton } from "../../../../components/global/Skeleton";

const USER_AVATAR = "https://randomuser.me/api/portraits/lego/3.jpg";

export default function AdminDashboard() {
    const [selectedTab, setSelectedTab] = useState(1);
    const { selectedDate } = useDate();
    const { isLoading } = useLoader();
    const { dashboardData = {}, eventMealRequest = [], userInformation = {} } = useData();

    // Safe User Info
    const userEmail = userInformation?.email || "No Email";
    const userName = (userInformation?.last_name && userInformation?.first_name)
        ? `${userInformation.last_name}, ${userInformation.first_name}`
        : "Admin User";
    const userRole = userInformation?.role || "Guest";

    // 🟢 REPLACED: getTimeframeKey(id)
    const timeframeKey = useMemo(() => {
        switch (selectedTab) {
            case 1: return 'today';
            case 2: return 'weekly';
            case 3: return 'monthly';
            default: return 'today';
        }
    }, [selectedTab]);

    const getChartData = (chartKey) => {
        if (!dashboardData || isLoading) return [];

        // 🟢 REPLACED: const timeframeKey = getTimeframeKey(selectedTab);
        const dataArray = dashboardData[timeframeKey];

        if (!Array.isArray(dataArray)) return [];

        const container = dataArray.find(obj => Object.keys(obj).includes(chartKey));
        return container ? container[chartKey] : [];
    };

    // 🟢 REPLACED: getStatsData() and statsData execution
    const statsData = useMemo(() => {
        const stats = dashboardData.stats || {};
        const claimed = stats.totalClaimed || 0;
        const unclaimed = stats.totalUnclaimed || 0;
        let eligible = stats.eligibleStudentCount || (claimed + unclaimed);

        const acceptedRate = eligible > 0 ? ((claimed / eligible) * 100).toFixed(1) : 0;
        const rejectedRate = eligible > 0 ? ((unclaimed / eligible) * 100).toFixed(1) : 0;

        return {
            absent: stats.absentStudentCount || 0,
            waived: stats.waivedStudentCount || 0,
            eligible: eligible,
            claimed: claimed, // 🟢 FIX: Added the claimed variable so the UI card works!
            acceptedRate,
            rejectedRate
        };
    }, [dashboardData.stats]);

    const getCurrentMetricValue = (chartKey) => {
        const data = getChartData(chartKey);
        if (data && data.length > 0) {
            const lastItem = data[data.length - 1];
            const value = lastItem.TADMC || 0;
            // toFixed(2) converts to string "0.00", parseFloat turns it back to a number
            return parseFloat(value.toFixed(2));
        }
        return 0;
    };

    const metricSubtitle = selectedTab === 1 ? "Today" : selectedTab === 2 ? "This Week" : "This Month";

    return (
        <>
            <div style={{ backgroundColor: "#F7F9F9", marginBottom: "30px" }} className="w-full h-auto flex flex-col justify-start">
                <HeaderBar
                    userAvatar={USER_AVATAR}
                    headerTitle={"Dashboard"}
                    userEmail={userEmail}
                    userName={userName}
                    userRole={userRole}
                />

                <div className="w-full">
                    <div style={{ borderRadius: '10px', marginTop: '20px', marginLeft: '20px', marginRight: '20px', backgroundColor: "#F7F9F9", width: "auto", display: 'grid', gridTemplateColumns: '70% 30%', gap: "18px", alignItems: 'start' }}>

                        <div className="w-full h-full flex flex-col gap-4">
                            <div className="grid grid-cols-6 gap-4">
                                <motion.div key={isLoading ? "skel-eligibility" : "real-eligibility"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="col-span-6">
                                    <StatsCardGroup
                                        cardGroupTitle={"Student Meal Eligibilty Count"}
                                        isDualPager={true}
                                        dualPageTitles={["View Student Counts", "View Claim Rates"]}
                                        footnote={`Data based on current ${metricSubtitle.toLowerCase()} records`}
                                        isLoading={isLoading}
                                        urgentNotification={0}
                                        primaryData={[
                                            { title: "Absent Students", value: statsData.absent },
                                            { title: "Waived Students", value: statsData.waived },
                                            { title: "Claimed Students", value: statsData.claimed },
                                            { title: "Eligible Students", value: statsData.eligible }
                                        ]}
                                        secondaryData={[
                                            { title: "Unclaimed Rate", value: statsData.rejectedRate, subtitle: metricSubtitle, isPercentage: true },
                                            { title: "Claimed Rate", value: statsData.acceptedRate, subtitle: metricSubtitle, isPercentage: true },
                                        ]}
                                    />
                                </motion.div>
                            </div>

                            <motion.div key={isLoading ? "skel-tabs" : "real-tabs"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <AnalyticTabs selectedTab={selectedTab} onTabChange={setSelectedTab}>
                                    <div className="w-[100%] flex flex-col items-center h-[100%] bg-[#FFFFFF]">

                                        {selectedTab === 4 && (
                                            <div className="flex flex-col items-center gap-4 w-full" style={{ padding: 10 }}>
                                                <StatsCardGroup urgentNotification={0} cardGroupTitle={"Dish Combination Claims Status"} isDualPager={true} dualPageTitles={["Least Claims", "Most Claims"]} primaryData={dashboardData.overall?.mostMealClaims} secondaryData={dashboardData.overall?.leastMealClaims} isLoading={isLoading} />
                                                <StatsCardGroup urgentNotification={0} cardGroupTitle={"KPI Metrics"} primaryData={dashboardData.overall?.KPIreports} isLoading={isLoading} />
                                                <StatsCardGroup urgentNotification={0} cardGroupTitle={"Consumed Credits"} primaryData={dashboardData.overall?.consumedCredits} isLoading={isLoading} />
                                            </div>
                                        )}

                                        {selectedTab !== 4 && selectedTab !== 5 && (
                                            <>
                                                {/* TRENDS CHART */}
                                                <div className="flex h-[270px] w-[98%] border-[#D9D9D9] border-[1px] mt-5 mb-2 rounded-xl" style={{ margin: 10 }}>
                                                    <div className="h-full w-full" style={{ padding: 20 }}>
                                                        <p className="font-geist text-sm text-gray-800">Claim Statistics Chart</p>
                                                        {isLoading ? <Skeleton className="w-full h-full rounded-lg" /> : <LineChartBox data={getChartData('trendsData')} />}
                                                    </div>
                                                </div>

                                                {/* 🟢 NEW: DAILY EXPENSES CHART */}
                                                <div className="flex h-[350px] w-[98%] border-[#D9D9D9] border-[1px] my-2 rounded-xl" style={{ margin: 10 }}>
                                                    <div className="h-full w-full" style={{ padding: 20 }}>
                                                        <p className="font-geist text-sm text-gray-800">Meal Value Spending Chart</p>
                                                        {isLoading ? <Skeleton className="w-full h-full rounded-lg" /> :
                                                            <DailyExpensesChart
                                                                data={getChartData('barChartData').map(item => ({
                                                                    name: item.dayOfWeek || item.date,
                                                                    claimed: item.Claimed,
                                                                    unclaimed: item.Unclaimed
                                                                }))}
                                                            />
                                                        }
                                                    </div>
                                                </div>

                                                {/* BAR CHART */}
                                                <div className="flex h-full w-[98%] border-[#D9D9D9] border-[1px] my-2 rounded-xl" style={{ margin: 10 }}>
                                                    <div className="h-full w-full" style={{ padding: 20 }}>
                                                        <p className="font-geist text-sm text-gray-800">Free Meal Claim Chart</p>
                                                        {isLoading ? <Skeleton className="w-full h-[200px] rounded-lg" /> : <BarChartBox data={getChartData('barChartData')} />}
                                                    </div>
                                                </div>

                                                {/* BANDED CHARTS */}
                                                {[
                                                    { key: 'TADMCdata', title: 'Average Daily Meal Cost', Chart: BandedChartTADMC, peso: true, range: [58, 62] },
                                                    { key: 'CURdata', title: 'Credit Utilization Rate', Chart: BandedChartCUR, pct: true, range: [90, 100] },
                                                    { key: 'OCFdata', title: 'Overclaim Frequency', Chart: BandedChartOCF, pct: true, range: [0, 15] }
                                                ].map((metric) => (
                                                    <div key={metric.key} className="flex h-full w-[98%] border-[#D9D9D9] border-[1px] my-2 rounded-xl" style={{ margin: 10 }}>
                                                        <div className="w-[30%] p-3 flex items-center justify-center" style={{ margin: 10 }}>
                                                            <CustomStatsCard
                                                                title={metric.title}
                                                                value={getCurrentMetricValue(metric.key)}
                                                                subtitle={metricSubtitle}
                                                                isPeso={metric.peso}
                                                                isPercentage={metric.pct}
                                                                isHasAcceptableRange={true}
                                                                acceptableRate={metric.range}
                                                                isLoading={isLoading}
                                                            />
                                                        </div>
                                                        <div className="h-full w-[70%]" style={{ padding: 20 }}>
                                                            {isLoading ? <Skeleton className="w-full h-[200px] rounded-lg" /> :
                                                                <metric.Chart data={getChartData(metric.key).map(d => ({
                                                                    name: d.Day || d.dayOfWeek || d.dataSpan,
                                                                    value: d.TADMC
                                                                }))} />
                                                            }
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                </AnalyticTabs>
                            </motion.div>
                        </div>

                        <div style={{ position: 'sticky', top: '35px', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: "18px" }}>
                            <OngoingEvents events={eventMealRequest[1] || []} isLoading={isLoading} />
                            <EventsPanel events={eventMealRequest[0] || []} isLoading={isLoading} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}