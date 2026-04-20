import React, { useState, useMemo } from "react"; 
import { motion } from "framer-motion";

// --- CONTEXT IMPORTS ---
import { useDate } from "../dashboard/DatePicker";
import { useData } from "../../../../context/DataContext";
import { useLoader } from "../../../../context/LoaderContext";

// --- COMPONENT IMPORTS ---
import { BandedChartTADMC } from "../charts/BandedChartTADMC";
import { BandedChartCUR } from "../charts/BandedChartCUR";
import { BandedChartOCF } from "../charts/BandedChartOCF";

import { LineChartBox } from "../charts/LineChartBox"; 
import { DailyExpensesChart } from "../charts/DailyExpensesChart";
import { CustomStatsCard } from "../dashboard/CustomStatsCard";
import { StatsCardGroup } from "../dashboard/StatsCardGroup";
import { BarChartBox } from "../charts/BarChartBox";

import { OngoingEvents } from "../dashboard/OngoingEvents";
import { EventsPanel } from "../dashboard/EventsPanel";

import { AnalyticTabs } from "../dashboard/AnalyticTabs";
import { MealOverridePanel } from "../dashboard/MealOverridePanel";
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

    // 🟢 timeframeKey dynamically updates based on the selected tab
    const timeframeKey = useMemo(() => {
        switch (selectedTab) {
            case 1: return 'today';
            case 2: return 'weekly';
            case 3: return 'monthly';
            default: return 'today';
        }
    }, [selectedTab]);

    // =========================================================================
    // 🟢 THE UPDATED CHART DATA FETCHER & TRANSLATOR
    // =========================================================================
    const getChartData = (chartKey) => {
        if (!dashboardData || isLoading) return [];

        const dataArray = dashboardData[timeframeKey];

        if (!Array.isArray(dataArray)) return [];

        const container = dataArray.find(obj => Object.keys(obj).includes(chartKey));
        const rawData = container ? container[chartKey] : [];

        // 🟢 THE TRANSLATOR: Intercept trendsData to fix the legacy backend issues
        if (chartKey === 'trendsData' && rawData.length > 0) {
            return rawData.map(item => ({
                dataSpan: item.dataSpan,
                Meals: item["Customized Order"] || 0,     
                Snacks: item["Pre-packed Food"] || 0,     
                Unclaimed: item["Unused vouchers"] ? Math.round(item["Unused vouchers"] / 60) : 0   
            }));
        }

        return rawData;
    };
    // =========================================================================

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
            claimed: claimed, 
            acceptedRate,
            rejectedRate
        };
    }, [dashboardData.stats]);

    const getCurrentMetricValue = (chartKey) => {
        const data = getChartData(chartKey);
        if (data && data.length > 0) {
            const lastItem = data[data.length - 1];
            const value = lastItem.TADMC || 0;
            return parseFloat(value.toFixed(2));
        }
        return 0;
    };

    // =========================================================================
    // 🟢 LOCAL TIMEZONE EVENT SORTER (Bypassing Backend UTC groupings)
    // =========================================================================
    const processedEvents = useMemo(() => {
        if (!Array.isArray(eventMealRequest) || eventMealRequest.length === 0) {
            return { ongoing: [], upcoming: [] };
        }

        const flatRawEvents = eventMealRequest.flat();
        const currentYear = new Date().getFullYear();
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const ongoing = [];
        const upcoming = [];

        flatRawEvents.forEach((event) => {
            if (!event) return;

            const startMonthIdx = months.indexOf(event.startMonth);
            const endMonthIdx = months.indexOf(event.endMonth);
            
            const startDate = new Date(currentYear, startMonthIdx, event.startDay);
            const endDate = new Date(currentYear, endMonthIdx, event.endDay, 23, 59, 59, 999);

            // Clone event to safely update the string status for child components
            const localEvent = { ...event };

            if (now >= startDate && now <= endDate) {
                localEvent.scheduleStatus = "ONGOING";
                ongoing.push(localEvent);
            } else if (startOfToday < startDate) {
                localEvent.scheduleStatus = "UPCOMING";
                upcoming.push(localEvent);
            }
            // Note: We ignore 'RECENT' here since the AdminDashboard sidebar doesn't show them!
        });

        return { ongoing, upcoming };
    }, [eventMealRequest]);
    // =========================================================================

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

                                                {/* DAILY EXPENSES CHART */}
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
                            {/* 🟢 Replaced index-based arrays with the locally processed data */}
                            <OngoingEvents events={processedEvents.ongoing} isLoading={isLoading} />
                            <EventsPanel events={processedEvents.upcoming} isLoading={isLoading} />
                            <MealOverridePanel />
                            <div className="h-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}