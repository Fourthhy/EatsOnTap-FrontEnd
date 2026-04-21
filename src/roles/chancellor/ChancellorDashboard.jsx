import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";

// --- CONTEXT IMPORTS ---
import { useDate } from "../admin/components/dashboard/DatePicker";
import { useData } from "../../context/DataContext";
import { useLoader } from "../../context/LoaderContext";

// --- COMPONENT IMPORTS ---
import { HeaderBar } from "../../components/global/HeaderBar";
import { Skeleton } from "../../components/global/Skeleton";

import { CustomStatsCard } from "../admin/components/dashboard/CustomStatsCard";
import { StatsCardGroup } from "../admin/components/dashboard/StatsCardGroup";
import { OngoingEvents } from "../admin/components/dashboard/OngoingEvents";
import { EventsPanel } from "../admin/components/dashboard/EventsPanel";
import { AnalyticTabs } from "../admin/components/dashboard/AnalyticTabs";
import { DatePicker } from "../admin/components/dashboard/DatePicker";

import { BandedChartTADMC } from "../admin/components/charts/BandedChartTADMC";
import { BandedChartCUR } from "../admin/components/charts/BandedChartCUR";
import { BandedChartOCF } from "../admin/components/charts/BandedChartOCF";
import { BarChartBox } from "../admin/components/charts/BarChartBox";
import { LineChartBox } from "../admin/components/charts/LineChartBox";
import { DailyExpensesChart } from "../admin/components/charts/DailyExpensesChart";

const USER_AVATAR = "https://randomuser.me/api/portraits/lego/3.jpg";

export default function ChancellorDashboard() {
    const [selectedTab, setSelectedTab] = useState(1);
    const { selectedDate } = useDate();
    const { isLoading } = useLoader();
    const { dashboardData = {}, eventMealRequest = [], userInformation = {} } = useData();

    // Safe User Info
    const userEmail = userInformation?.email || "No Email";
    const userName = (userInformation?.last_name && userInformation?.first_name)
        ? `${userInformation.last_name}, ${userInformation.first_name}`
        : "Chancellor User";
    const userRole = userInformation?.role || "Chancellor";

    // Timeframe dynamically updates based on the selected tab
    const timeframeKey = useMemo(() => {
        switch (selectedTab) {
            case 1: return 'today';
            case 2: return 'weekly';
            case 3: return 'monthly';
            default: return 'today';
        }
    }, [selectedTab]);

    // =========================================================================
    // CHART DATA FETCHER & TRANSLATOR
    // =========================================================================
    const getChartData = (chartKey) => {
        if (!dashboardData || isLoading) return [];

        const dataArray = dashboardData[timeframeKey];
        if (!Array.isArray(dataArray)) return [];

        const container = dataArray.find(obj => Object.keys(obj).includes(chartKey));
        const rawData = container ? container[chartKey] : [];

        // Translator for legacy trends data structures
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
    // ONGOING/UPCOMING EVENT PROCESSOR
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

            const localEvent = { ...event };

            if (now >= startDate && now <= endDate) {
                localEvent.scheduleStatus = "ONGOING";
                ongoing.push(localEvent);
            } else if (startOfToday < startDate) {
                localEvent.scheduleStatus = "UPCOMING";
                upcoming.push(localEvent);
            }
        });

        return { ongoing, upcoming };
    }, [eventMealRequest]);

    const metricSubtitle = selectedTab === 1 ? "Today" : selectedTab === 2 ? "This Week" : "This Month";

    // Configurations mapping for rendering metric charts cleanly
    const bandedChartConfigs = [
        { 
            key: 'TADMCdata', title: 'Average Student Spending', Chart: BandedChartTADMC, peso: true, pct: false, range: [58, 62],
            hoverText: "Measures how much money is actually spent on a meal when a student makes a claim.",
            hoverValueText: "The ideal target range should be close to the currently assigned credit value (₱60)"
        },
        { 
            key: 'CURdata', title: 'Credit Utilization Rate', Chart: BandedChartCUR, peso: false, pct: true, range: [90, 100],
            hoverText: "The percentage of the total allocated credit budget that is actually consumed by the students before the unused amount is automatically removed.",
            hoverValueText: "A rate below 90% implies significant budget waste"
        },
        { 
            key: 'OCFdata', title: 'Overclaim Frequency', Chart: BandedChartOCF, peso: false, pct: true, range: [0, 15],
            hoverText: "The frequency at which students’ total food item cost exceed the assigned credit value",
            hoverValueText: "An OCF above 15% means too many students are frequently forced to pay out-of-pocket, which diminishes the value and intent of the scholarship/subsidy"
        }
    ];

    return (
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
                    
                    {/* LEFT COLUMN: MAIN CONTENT */}
                    <div className="w-full h-full flex flex-col gap-4">
                        <div className="grid grid-cols-7 gap-4">
                            <motion.div key={isLoading ? "skel-claims" : "real-claims"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="col-span-7">
                                <StatsCardGroup
                                    cardGroupTitle={"Meal Claim Status"}
                                    isDualPager={true}
                                    dualPageTitles={["View Student Counts", "View Claim Rates"]}
                                    footnote={`Data based on current ${metricSubtitle.toLowerCase()} records`}
                                    isLoading={isLoading}
                                    urgentNotification={0}
                                    primaryData={[
                                        { title: "Total Absent Students", value: statsData.absent, subtitle: "Total program slots" },
                                        { title: "Total Waived Students", value: statsData.waived, subtitle: "Opted out of claims" },
                                        { title: "Students Claimed", value: statsData.claimed, subtitle: "Free lunch and items" },
                                        { title: "Total Eligible Students", value: statsData.eligible, subtitle: "Total program slots" }
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

                                    {/* TAB 4: OVERALL */}
                                    {selectedTab === 4 && (
                                        <div className="flex flex-col items-center gap-4 w-full" style={{ padding: 10 }}>
                                            <StatsCardGroup urgentNotification={0} cardGroupTitle={"Dish Combination Claims Status"} isDualPager={true} dualPageTitles={["Most Claims", "Least Claims"]} primaryData={dashboardData.overall?.mostMealClaims} secondaryData={dashboardData.overall?.leastMealClaims} isLoading={isLoading} displayDate={false} />
                                            <StatsCardGroup urgentNotification={0} cardGroupTitle={"Claims Count"} primaryData={dashboardData.overall?.claimsCount} isLoading={isLoading} displayDate={false} />
                                            <StatsCardGroup urgentNotification={0} cardGroupTitle={"KPI Metrics"} primaryData={dashboardData.overall?.KPIreports} isLoading={isLoading} displayDate={false} />
                                            <StatsCardGroup urgentNotification={0} cardGroupTitle={"Consumed Credits"} primaryData={dashboardData.overall?.consumedCredits} isLoading={isLoading} displayDate={false} />
                                        </div>
                                    )}

                                    {/* TAB 5: CUSTOM DATE */}
                                    {selectedTab === 5 && (
                                        <div className="w-full flex flex-col items-center gap-4" style={{ padding: 10 }}>
                                            <div className="w-full mb-2">
                                                <DatePicker />
                                            </div>
                                            {selectedDate && (
                                                <>
                                                    <StatsCardGroup urgentNotification={0} cardGroupTitle={"Dish Combination Claims Status"} primaryData={dashboardData.customDate?.dishForDay} isLoading={isLoading} displayDate={false} />
                                                    <StatsCardGroup urgentNotification={0} cardGroupTitle={"Claims Count"} primaryData={dashboardData.customDate?.claimsCount} isLoading={isLoading} displayDate={false} />
                                                    <StatsCardGroup urgentNotification={0} cardGroupTitle={"KPI Metrics"} primaryData={dashboardData.customDate?.KPIreports} isLoading={isLoading} displayDate={false} />
                                                    <StatsCardGroup urgentNotification={0} cardGroupTitle={"Consumed Credits"} primaryData={dashboardData.customDate?.consumedCredits} isLoading={isLoading} displayDate={false} />
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* TABS 1, 2, 3: TIME PERIOD CHARTS */}
                                    {selectedTab !== 4 && selectedTab !== 5 && (
                                        <>
                                            {/* TRENDS CHART */}
                                            <div className="flex h-[270px] w-[98%] border-[#D9D9D9] border-[1px] mt-5 mb-2 rounded-xl" style={{ margin: 10 }}>
                                                <div className="w-[30%] h-auto flex items-center justify-center p-4">
                                                    <CustomStatsCard 
                                                        title={"Unclaim Count"} 
                                                        value={statsData.waived || 0} 
                                                        subtitle={metricSubtitle} 
                                                        isPeso={false} 
                                                        isPercentage={false} 
                                                        isHasAcceptableRange={false} 
                                                        hoverText={`The count of how many claims are not claimed for this ${metricSubtitle.toLowerCase()}`} 
                                                    />
                                                </div>
                                                <div className="h-[100%] w-[70%] flex justify-end items-center p-4">
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
                                                <div className="w-[30%] h-auto flex items-center justify-center p-4">
                                                    <CustomStatsCard 
                                                        title={"Dish Claims"} 
                                                        value={statsData.claimed || 0} 
                                                        subtitle={`Total Claims`} 
                                                        isPeso={false} 
                                                        isPercentage={false} 
                                                        isHasAcceptableRange={false} 
                                                        hoverText={`The count of how many free meal claims are made for this ${metricSubtitle.toLowerCase()}`} 
                                                    />
                                                </div>
                                                <div className="h-[100%] w-[70%] flex justify-end items-center p-4">
                                                    {isLoading ? <Skeleton className="w-full h-[200px] rounded-lg" /> : <BarChartBox data={getChartData('barChartData')} />}
                                                </div>
                                            </div>

                                            {/* BANDED CHARTS MAP */}
                                            {bandedChartConfigs.map((metric) => (
                                                <div key={metric.key} className="flex h-full w-[98%] border-[#D9D9D9] border-[1px] my-2 rounded-xl" style={{ margin: 10 }}>
                                                    <div className="w-[30%] h-auto flex items-center justify-center p-4">
                                                        <CustomStatsCard
                                                            title={metric.title}
                                                            value={getCurrentMetricValue(metric.key)}
                                                            subtitle={metricSubtitle}
                                                            isPeso={metric.peso}
                                                            isPercentage={metric.pct}
                                                            isHasAcceptableRange={true}
                                                            acceptableRate={metric.range}
                                                            hoverText={metric.hoverText}
                                                            hoverValueText={metric.hoverValueText}
                                                            isLoading={isLoading}
                                                        />
                                                    </div>
                                                    <div className="h-[100%] w-[70%] flex justify-end items-center p-4">
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

                    {/* RIGHT COLUMN: SIDEBAR */}
                    <div style={{ position: 'sticky', top: '35px', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: "18px" }}>
                        <OngoingEvents events={processedEvents.ongoing} isLoading={isLoading} />
                        <EventsPanel events={processedEvents.upcoming} isLoading={isLoading} isHyerlink={false} canViewAll={false} />
                        <div className="h-4"></div>
                    </div>

                </div>
            </div>
        </div>
    );
}