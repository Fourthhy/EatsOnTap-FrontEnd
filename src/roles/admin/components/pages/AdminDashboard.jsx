import { useState } from "react"
import { useDate } from "../dashboard/DatePicker"
import { BandedChartTADMC } from "../charts/BandedChartTADMC"
import { BandedChartCUR } from "../charts/BandedChartCUR"
import { BandedChartOCF } from "../charts/BandedChartOCF"
import { CustomStatsCard } from "../dashboard/CustomStatsCard"
import { StatsCardGroup } from "../dashboard/StatsCardGroup"
import { BarChartBox } from "../charts/BarChartBox";
import { LineChartBox } from "../charts/LineChartBox";
import { QuickActions } from "../dashboard/QuickActions";
import { OngoingEvents } from "../dashboard/OngoingEvents"
import { EventsPanel } from "../dashboard/EventsPanel";
import { AnalyticTabs } from "../dashboard/AnalyticTabs";
import { DatePicker } from "../dashboard/DatePicker"
import { HeaderBar } from "../../../../components/global/HeaderBar"

import { useOutletContext } from 'react-router-dom';
import { Menu } from "lucide-react"
import { RiNotification2Fill } from "react-icons/ri";


// Example logo API usage
const USER_AVATAR = "https://randomuser.me/api/portraits/lego/3.jpg";

export default function AdminDashboard() {
    const [selectedTab, setSelectedTab] = useState(1);
    const { selectedDate } = useDate();

    const extractedMealRequestData = {
        acceptedRequests: [
            { title: "Accepted Request Rate", value: 100, subtitle: "Overall", acceptanceRate: 95, expectingPositiveResult: true, isPercentage: true },
            { title: "Accepted Request Count", value: 34, subtitle: "Today" },
            { title: "Total Eligible Students", value: 1500, subtitle: "Today" }
        ],
        rejectedRequests: [
            { title: "Rejected Request Rate", value: 0, subtitle: "Overall", acceptanceRate: 5, expectingPositiveResult: false, isPercentage: true },
            { title: "Rejected Request Count", value: 0, subtitle: "Today" },
            { title: "Total Waived Students", value: 0, subtitle: "Today" }
        ]
    }

    const extractedData = {
        today: [
            {
                barChartData: [
                    { dayOfWeek: "Tuesday", dish1: "Burger Steak", dish2: "", Claimed: 420, Unclaimed: 1503 },
                    { dayOfWeek: "Wednesday", dish1: "Menudo", dish2: "Adobo", Claimed: 100, Unclaimed: 2175 },
                    { dayOfWeek: "Thursday", dish1: "Fried Chicken", dish2: "Ampalaya", Claimed: 200, Unclaimed: 1863 },
                    { dayOfWeek: "Friday", dish1: "Tortang Talong", dish2: "Ampalaya", Claimed: 632, Unclaimed: 1698 },
                    { dayOfWeek: "Saturday", dish1: "Hotdog", dish2: "Egg", Claimed: 0, Unclaimed: 423 },
                ]
            },
            {
                trendsData: [
                    { dataSpan: "Jan", "Pre-packed Food": 200, "Customized Order": 200, "Unused vouchers": 300 },
                    { dataSpan: "Feb", "Pre-packed Food": 1300, "Customized Order": 300, "Unused vouchers": 100 },
                    { dataSpan: "Mar", "Pre-packed Food": 1200, "Customized Order": 100, "Unused vouchers": 500 },
                    { dataSpan: "Apr", "Pre-packed Food": 900, "Customized Order": 50, "Unused vouchers": 50 },
                ]
            },
            {
                TADMCdata: [
                    { Day: 'Mon 1', AcceptableRange: [58, 62], TADMC: 60.50 },
                    { Day: 'Tue 2', AcceptableRange: [58, 62], TADMC: 61.25 },
                    { Day: 'Wed 3', AcceptableRange: [58, 62], TADMC: 59.80 },
                    { Day: 'Thu 4', AcceptableRange: [58, 62], TADMC: 57.90 },
                    { Day: 'Fri 5', AcceptableRange: [58, 62], TADMC: 63.50 },
                    { Day: 'Sat 6', AcceptableRange: [58, 62], TADMC: 61.90 },
                    { Day: 'Mon 8', AcceptableRange: [58, 62], TADMC: 61.00 },
                ]
            },
            {
                CURdata: [
                    { Day: 'Mon 1', AcceptableRange: [90, 100], TADMC: 92.50 },
                    { Day: 'Tue 2', AcceptableRange: [90, 100], TADMC: 98.25 },
                    { Day: 'Wed 3', AcceptableRange: [90, 100], TADMC: 94.80 },
                    { Day: 'Thu 4', AcceptableRange: [90, 100], TADMC: 89.90 },
                    { Day: 'Fri 5', AcceptableRange: [90, 100], TADMC: 101.50 },
                    { Day: 'Sat 6', AcceptableRange: [90, 100], TADMC: 96.90 },
                    { Day: 'Mon 8', AcceptableRange: [90, 100], TADMC: 95.00 },
                ]
            },
            {
                OCFdata: [
                    { Day: 'Mon 1', AcceptableRange: [0, 15], TADMC: 5.50 },
                    { Day: 'Tue 2', AcceptableRange: [0, 15], TADMC: 12.25 },
                    { Day: 'Wed 3', AcceptableRange: [0, 15], TADMC: 8.80 },
                    { Day: 'Thu 4', AcceptableRange: [0, 15], TADMC: 1.90 },
                    { Day: 'Fri 5', AcceptableRange: [0, 15], TADMC: 16.50 },
                    { Day: 'Sat 6', AcceptableRange: [0, 15], TADMC: 10.90 },
                    { Day: 'Mon 8', AcceptableRange: [0, 15], TADMC: 7.00 },
                ]
            }
        ],
        weekly: [
            {
                barChartData: [
                    { dayOfWeek: "Week 1", dish1: "Burger Steak", dish2: "Adobo", Claimed: 2000, Unclaimed: 500 },
                    { dayOfWeek: "Week 2", dish1: "Menudo", dish2: "Fried Chicken", Claimed: 1500, Unclaimed: 700 },
                    { dayOfWeek: "Week 3", dish1: "Pork Sinigang", dish2: "Caldereta", Claimed: 2200, Unclaimed: 300 },
                    { dayOfWeek: "Week 4", dish1: "Tilapia", dish2: "Pinakbet", Claimed: 1800, Unclaimed: 600 },
                ]
            },
            {
                trendsData: [
                    { dataSpan: "Week 1", "Pre-packed Food": 500, "Customized Order": 100, "Unused vouchers": 50 },
                    { dataSpan: "Week 2", "Pre-packed Food": 700, "Customized Order": 150, "Unused vouchers": 70 },
                    { dataSpan: "Week 3", "Pre-packed Food": 600, "Customized Order": 120, "Unused vouchers": 60 },
                    { dataSpan: "Week 4", "Pre-packed Food": 800, "Customized Order": 180, "Unused vouchers": 80 },
                ]
            },
            {
                TADMCdata: [
                    { Day: 'Week 1', AcceptableRange: [58, 62], TADMC: 59.00 },
                    { Day: 'Week 2', AcceptableRange: [58, 62], TADMC: 60.00 },
                    { Day: 'Week 3', AcceptableRange: [58, 62], TADMC: 61.50 },
                    { Day: 'Week 4', AcceptableRange: [58, 62], TADMC: 58.50 },
                ]
            },
            {
                CURdata: [
                    { Day: 'Week 1', AcceptableRange: [90, 100], TADMC: 95.00 },
                    { Day: 'Week 2', AcceptableRange: [90, 100], TADMC: 97.00 },
                    { Day: 'Week 3', AcceptableRange: [90, 100], TADMC: 93.00 },
                    { Day: 'Week 4', AcceptableRange: [90, 100], TADMC: 98.00 },
                ]
            },
            {
                OCFdata: [
                    { Day: 'Week 1', AcceptableRange: [0, 15], TADMC: 10.00 },
                    { Day: 'Week 2', AcceptableRange: [0, 15], TADMC: 8.00 },
                    { Day: 'Week 3', AcceptableRange: [0, 15], TADMC: 12.00 },
                    { Day: 'Week 4', AcceptableRange: [0, 15], TADMC: 6.00 },
                ]
            }
        ],
        monthly: [
            {
                barChartData: [
                    { dayOfWeek: "Month 1", dish1: "Chicken Curry", dish2: "Bistek", Claimed: 8000, Unclaimed: 2000 },
                    { dayOfWeek: "Month 2", dish1: "Sinigang na Hipon", dish2: "Kare-Kare", Claimed: 7500, Unclaimed: 2500 },
                    { dayOfWeek: "Month 3", dish1: "Lechon Kawali", dish2: "Dinuguan", Claimed: 9000, Unclaimed: 1000 },
                    { dayOfWeek: "Month 4", dish1: "Pancit Canton", dish2: "Lumpia", Claimed: 8200, Unclaimed: 1800 },
                ]
            },
            {
                trendsData: [
                    { dataSpan: "Month 1", "Pre-packed Food": 2000, "Customized Order": 500, "Unused vouchers": 200 },
                    { dataSpan: "Month 2", "Pre-packed Food": 2200, "Customized Order": 600, "Unused vouchers": 150 },
                    { dataSpan: "Month 3", "Pre-packed Food": 2500, "Customized Order": 700, "Unused vouchers": 100 },
                    { dataSpan: "Month 4", "Pre-packed Food": 2300, "Customized Order": 650, "Unused vouchers": 180 },
                ]
            },
            {
                TADMCdata: [
                    { Day: 'Month 1', AcceptableRange: [58, 62], TADMC: 60.00 },
                    { Day: 'Month 2', AcceptableRange: [58, 62], TADMC: 59.50 },
                    { Day: 'Month 3', AcceptableRange: [58, 62], TADMC: 61.00 },
                    { Day: 'Month 4', AcceptableRange: [58, 62], TADMC: 60.20 },
                ]
            },
            {
                CURdata: [
                    { Day: 'Month 1', AcceptableRange: [90, 100], TADMC: 96.00 },
                    { Day: 'Month 2', AcceptableRange: [90, 100], TADMC: 95.50 },
                    { Day: 'Month 3', AcceptableRange: [90, 100], TADMC: 97.00 },
                    { Day: 'Month 4', AcceptableRange: [90, 100], TADMC: 96.50 },
                ]
            },
            {
                OCFdata: [
                    { Day: 'Month 1', AcceptableRange: [0, 15], TADMC: 9.00 },
                    { Day: 'Month 2', AcceptableRange: [0, 15], TADMC: 11.00 },
                    { Day: 'Month 3', AcceptableRange: [0, 15], TADMC: 8.00 },
                    { Day: 'Month 4', AcceptableRange: [0, 15], TADMC: 10.00 },
                ]
            }
        ],
    }

    const extractedOverallData = {
        mostMealClaims: [
            { title: "Third Most Meal Combination", value: "Hatdog / Longganisa", subtitle: "28.31% of total | 2,123 claims" },
            { title: "Second Most Meal Combination", value: "Adobo / Menudo", subtitle: "31.01% of total | 2,325 claims" },
            { title: "Most Claimed Combination", value: "Chicken Curry / Burger Steak", subtitle: "33.72% of total | 2,529 claims" },
        ],
        leastMealClaims: [
            { title: "Third Least Claimed Combination", value: "Miswa / Sotanghon", subtitle: "3.30% of total | 247 claims" },
            { title: "Second Least Claimed Combination", value: "Monggo / Fried Fish", subtitle: "2.90% of total | 217 claims" },
            { title: "Least Claimed Combination", value: "Ampalaya / Itlog", subtitle: "2.47% of total | 185 claims" },
        ],
        claimsCount: [
            { title: "Overall Unclaimed Count", value: 10, inPercentage: true, subtitle: "1000 claims" },
            { title: "Overall Food Item Claim Count", value: 40, inPercentage: true, subtitle: "6000 claims" },
            { title: "Overall Free Meal Claim Count", value: 50, inPercentage: true, subtitle: "7500 claims" },
            { title: "Overall Claim Count", value: 15000, subtitle: "Free Meal + Food Item Claim" },
        ],
        KPIreports: [
            { title: "Average OCF", value: 10.00, isPercentage: true, subtitle: "Overall" },
            { title: "Average CUR", value: 95.00, isPercentage: true, subtitle: "Overall" },
            { title: "Average TADMC", value: 60.00, subtitle: "Overall" },
        ],
        consumedCredits: [
            { title: "Total Unused Credits", value: "₱2,340", subtitle: "The actual unused credits" },
            { title: "Total Consumed Credits", value: "₱150,000", subtitle: "The actual consumed credits" },
        ]
    }

    const extractedCustomDateData = {
        dishForDay: [
            { title: "Dish for the day", value: "Chicken Curry / Adobo", subtitle: "53.32% of total | 2,529 claims" }
        ],
        claimsCount: [
            { title: "Unclaimed Count", value: 10, inPercentage: true, subtitle: "1000 claims" },
            { title: "Food Item Claim Count", value: 40, inPercentage: true, subtitle: "6000 claims" },
            { title: "Free Meal Claim Count", value: 50, inPercentage: true, subtitle: "7500 claims" },
            { title: "Claim Count", value: 15000, subtitle: "Free Meal + Food Item Claim" },
        ],
        KPIreports: [
            { title: "Average OCF", value: 10.00, isPercentage: true, subtitle: "Overall" },
            { title: "Average CUR", value: 95.00, isPercentage: true, subtitle: "Overall" },
            { title: "Average TADMC", value: 60.00, subtitle: "Overall" },
        ],
        consumedCredits: [
            { title: "Total Unused Credits", value: "₱2,340", subtitle: "The actual unused credits" },
            { title: "Total Consumed Credits", value: "₱150,000", subtitle: "The actual consumed credits" },
        ]
    }

    const upcomingEvents = [
        { link: "#", title: "Teachers' Day", date: "Oct 5, 2025" },
        { link: "#", title: "President' Day", date: "Nov 25, 2025" },
        { link: "#", title: "College Intramurals", date: "Dec 15, 2025" },
        { link: "#", title: "ICT Week", date: "Jan 19, 2026" }
    ]

    const ongoingEvents = [
        { link: "#", title: "Vacation!!!", date: "December 23, 2025" },
    ]


    const getTimeframeKey = (id) => {
        switch (id) {
            case 1: return 'today';
            case 2: return 'weekly';
            case 3: return 'monthly';
            case 4: return 'overall';
            default: return 'today';
        }
    };

    const getChartData = (dataKey) => {
        const timeKey = getTimeframeKey(selectedTab); // e.g., "today"
        const timeDataArray = extractedData[timeKey]; // The array of objects

        if (!timeDataArray) return []; // Safety check

        // Find the object in the array that contains the key we want (e.g. "TADMCdata")
        const foundItem = timeDataArray.find(item => item[dataKey]);

        return foundItem ? foundItem[dataKey] : [];
    };



    const context = useOutletContext() || {};
    const handleToggleSidebar = context.handleToggleSidebar || (() => { });

    return (
        <>
            <div
                style={{
                    backgroundColor: "#F7F9F9",
                    marginBottom: "30px"
                }}
                className="w-full h-auto flex flex-col justify-start">
                {/*HEADER*/}
                <HeaderBar userAvatar={USER_AVATAR} headerTitle={"Dashboard"} />

                {/* CONTENT */}

                <div className="w-full">
                    <div
                        style={{
                            borderRadius: '10px',
                            marginTop: '20px',
                            marginLeft: '20px',
                            marginRight: '20px',
                            backgroundColor: "#F7F9F9",
                            width: "auto",
                            display: 'grid',
                            gridTemplateColumns: '70% 30%',
                            gap: "18px",
                            alignItems: 'start',
                        }}>

                        {/* LEFT SIDE COMPONENTS */}
                        <div className="w-full h-full flex flex-col gap-4">
                            <div className="grid grid-cols-6 gap-4">
                                <div className="h-full col-span-2">
                                    <CustomStatsCard title={"Daily Virtual Credit Used"} value={"P60,000"} subtitle={"vs P65,000 allotted"} />
                                </div>

                                <div className="col-span-4">
                                    <StatsCardGroup
                                        cardGroupTitle={"Meal Eligibilty List Count"}
                                        urgentNotification={0}
                                        isDualPager={true}
                                        dualPageTitles={["View Accepted Requests", "View Rejected Requests"]}
                                        successMessage="Great job! The acceptance rate is above the target."
                                        failureMessage="Warning: Acceptance rate is critically low."
                                        primaryData={extractedMealRequestData.acceptedRequests}
                                        secondaryData={extractedMealRequestData.rejectedRequests}
                                    />
                                </div>
                            </div>

                            <AnalyticTabs selectedTab={selectedTab} onTabChange={setSelectedTab}>
                                <div className="w-[100%] flex flex-col items-center h-[100%] bg-[#FFFFFF]">

                                    {selectedTab === 4
                                        ? <>
                                            <div className="flex flex-col items-center gap-4 w-full" style={{ padding: 10 }}>
                                                <div className="flex h-full w-[98%] border-gray-100 border-[1px] rounded-xl">
                                                    <StatsCardGroup
                                                        cardGroupTitle={"Dish Combination Claims Status"}
                                                        isDualPager={true}
                                                        dualPageTitles={["View Most Claims", "View Least Claims"]}

                                                        primaryData={extractedOverallData.mostMealClaims}
                                                        secondaryData={extractedOverallData.leastMealClaims}

                                                        displayDate={false}
                                                        urgentNotification={0}
                                                    />
                                                </div>
                                                <div className="flex h-full w-[98%] border-gray-100 border-[1px] rounded-xl">
                                                    <StatsCardGroup
                                                        cardGroupTitle={"Claims Count"}
                                                        isDualPager={false}

                                                        primaryData={extractedOverallData.claimsCount}

                                                        displayDate={false}
                                                        urgentNotification={0}
                                                    />
                                                </div>
                                                <div className="flex h-full w-[98%] border-gray-100 border-[1px] rounded-xl">
                                                    <StatsCardGroup
                                                        cardGroupTitle={"KPI Metrics"}
                                                        isDualPager={false}

                                                        primaryData={extractedOverallData.KPIreports}

                                                        displayDate={false}
                                                        urgentNotification={0}
                                                    />
                                                </div>
                                                <div className="flex h-full w-[98%] border-gray-100 border-[1px] rounded-xl">
                                                    <StatsCardGroup
                                                        cardGroupTitle={"Consumed Credits"}
                                                        isDualPager={false}

                                                        primaryData={extractedOverallData.consumedCredits}

                                                        displayDate={false}
                                                        urgentNotification={0}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                        : ""}
                                    {selectedTab === 5
                                        ? <>
                                            <div clasName="w-full">
                                                <DatePicker />
                                                {selectedDate
                                                    ? <>
                                                        <div className="flex h-full w-[98%] border-[#D9D9D9] border-[1px]" style={{ marginTop: 10, marginBottom: 10, borderRadius: 10 }}>
                                                            <StatsCardGroup
                                                                cardGroupTitle={"Dish Combination Claims Status"}
                                                                isDualPager={false}

                                                                primaryData={extractedCustomDateData.dishForDay}

                                                                displayDate={false}
                                                                urgentNotification={0}
                                                            />
                                                        </div>
                                                        <div className="flex h-full w-[98%] border-[#D9D9D9] border-[1px]" style={{ marginTop: 10, marginBottom: 10, borderRadius: 10 }}>
                                                            <StatsCardGroup
                                                                cardGroupTitle={"Claims Count"}
                                                                isDualPager={false}

                                                                primaryData={extractedCustomDateData.claimsCount}

                                                                displayDate={false}
                                                                urgentNotification={0}
                                                            />
                                                        </div>
                                                        <div className="flex h-full w-[98%] border-[#D9D9D9] border-[1px]" style={{ marginTop: 10, marginBottom: 10, borderRadius: 10 }}>
                                                            <StatsCardGroup
                                                                cardGroupTitle={"KPI Metrics"}
                                                                isDualPager={false}

                                                                primaryData={extractedCustomDateData.KPIreports}

                                                                displayDate={false}
                                                                urgentNotification={0}
                                                            />
                                                        </div>
                                                        <div className="flex h-full w-[98%] border-[#D9D9D9] border-[1px]" style={{ marginTop: 10, marginBottom: 10, borderRadius: 10 }}>
                                                            <StatsCardGroup
                                                                cardGroupTitle={"Consumed Credits"}
                                                                isDualPager={false}

                                                                primaryData={extractedCustomDateData.consumedCredits}

                                                                displayDate={false}
                                                                urgentNotification={0}
                                                            />
                                                        </div>
                                                    </>
                                                    : ""}
                                            </div>
                                        </> : ""
                                    }
                                    {selectedTab !== 4 && selectedTab !== 5
                                        ?
                                        <>
                                            <div className="flex h-full w-[98%] border-[#D9D9D9] border-[1px]" style={{ marginTop: 10, marginBottom: 10, borderRadius: 10 }}>
                                                <div className="w-[25%] h-auto flex items-center justify-center" style={{ paddingTop: 20, paddingBottom: 20, marginLeft: 20 }}>
                                                    <CustomStatsCard title={"Dish Claims Today"} value={100} subtitle={"Today's Meal: Adobo"} isPeso={false} isPercentage={false} isHasAcceptableRange={false} hoverText="The count of how many claims are made for this day" />
                                                </div>
                                                <div className="h-[100%] w-[75%] flex justify-end items-center">
                                                    <BarChartBox data={getChartData('barChartData')} />
                                                </div>
                                            </div>

                                            <div className="flex h-[270px] w-[98%] border-[#D9D9D9] border-[1px]" style={{ marginBottom: 10, borderRadius: 10 }}>
                                                <div className="w-[25%] h-auto flex items-center justify-center" style={{ paddingTop: 20, paddingBottom: 20, marginLeft: 20 }}>
                                                    <CustomStatsCard title={"Unclaim Count"} value={100} subtitle={"Today"} isPeso={false} isPercentage={false} isHasAcceptableRange={false} hoverText="The count of how many claims are not claimed for this day" />
                                                </div>
                                                <div className="h-[100%] w-[75%] flex justify-end items-center">
                                                    <LineChartBox data={getChartData('trendsData')} />
                                                </div>
                                            </div>

                                            <div className="flex h-full w-[98%] border-[#D9D9D9] border-[1px]" style={{ marginBottom: 10, borderRadius: 10 }}>
                                                <div className="w-[25%] h-auto flex items-center justify-center" style={{ paddingTop: 20, paddingBottom: 20, marginLeft: 20 }}>
                                                    <CustomStatsCard
                                                        title={"Average Student Spending"} value={61} subtitle={"Today"} isPeso={true} isHasAcceptableRange={true} acceptableRate={[58, 62]} hoverText="Measures how much money is actually spent on a meal when a student makes a claim." hoverValueText={"The ideal target range should be close to the currently assigned credit value (₱60)"} />
                                                </div>
                                                <div className="h-[100%] w-[75%] flex justify-end items-center">
                                                    <BandedChartTADMC data={getChartData('TADMCdata')} />
                                                </div>
                                            </div>

                                            <div className="flex h-full w-[98%] border-[#D9D9D9] border-[1px]" style={{ marginBottom: 10, borderRadius: 10 }}>
                                                <div className="w-[25%] h-auto flex items-center justify-center" style={{ paddingTop: 20, paddingBottom: 20, marginLeft: 20 }}>
                                                    <CustomStatsCard title={"Credit Utilization Rate"} value={95} subtitle={"Today"} isPeso={false} isPercentage={true} isHasAcceptableRange={true} acceptableRate={[90, 100]} hoverText={"The percentage of the total allocated credit budget that is actually consumed by the students before the unused amount is automatically removed."} hoverValueText={"A rate below 90% implies significant budget waste"} />
                                                </div>
                                                <div className="h-[100%] w-[75%] flex justify-end items-center">
                                                    <BandedChartCUR data={getChartData('CURdata')} />
                                                </div>
                                            </div>

                                            <div className="flex h-full w-[98%] border-[#D9D9D9] border-[1px]" style={{ marginBottom: 10, borderRadius: 10 }}>
                                                <div className="w-[25%] h-auto flex items-center justify-center" style={{ paddingTop: 20, paddingBottom: 20, marginLeft: 20 }}>
                                                    <CustomStatsCard title={"Overclaim Frequency"} value={7} subtitle={"Today"} isPeso={false} isPercentage={true} isHasAcceptableRange={true} acceptableRate={[0, 15]} hoverText={"The frequency at which students’ total food item cost exceed the assigned credit value"} hoverValueText={"An OCF above 15% means too many students are frequently forced to pay out-of-pocket, which diminishes the value and intent of the scholarship/subsidy"} />
                                                </div>
                                                <div className="h-[100%] w-[75%] flex justify-end items-center">
                                                    <BandedChartOCF data={getChartData('OCFdata')} />
                                                </div>
                                            </div>
                                        </>
                                        : ""
                                    }
                                </div>
                            </AnalyticTabs>
                        </div>

                        {/* RIGHT SIDE COMPONENTS */}
                        <div
                            style={{
                                position: 'sticky',
                                top: '35px', // This is the gap from the top of the screen
                                height: 'fit-content',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: "18px",
                                alignSelf: 'start',

                            }}>
                            <div>
                                <OngoingEvents events={ongoingEvents} />
                            </div>
                            <div>
                                <EventsPanel events={upcomingEvents} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}