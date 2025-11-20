import { logout } from "../../functions/logoutAuth"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"
import { StatsCard } from "./components/StatsCard"
import { BandedChartTADMC } from "./components/charts/BandedChartTADMC"
import { BandedChartCUR } from "./components/charts/BandedChartCUR"
import { BandedChartOCF } from "./components/charts/BandedChartOCF"
import { CustomStatsCard } from "./components/CustomStatsCard"
import { StatsCardGroup } from "./components/StatsCardGroup"
import { PieChartBox } from "./components/charts/PieChartBox";
import { BarChartBox } from "./components/charts/BarChartBox";
import { LineChartBox } from "./components/charts/LineChartBox";
import { QuickActions } from "./components/QuickActions";
import { EventsPanel } from "./components/EventsPanel";
import { AnalyticTabs } from "./components/AnalyticTabs";
import { MealAllowanceCard } from "./components/MealAllowanceCard";
import { useOutletContext } from 'react-router-dom';
import { Menu } from "lucide-react"
import { RiNotification2Fill } from "react-icons/ri";


// Example logo API usage
const SCHOOL_LOGO = "https://logo.clearbit.com/up.edu.ph";
const USER_AVATAR = "https://randomuser.me/api/portraits/lego/3.jpg";

export default function AdminDashboard({ data }) {


    const navigate = useNavigate();

    const context = useOutletContext() || {};
    const handleToggleSidebar = context.handleToggleSidebar || (() => { });

    const handleLogout = () => {
        logout();
        navigate('/'); // redirect to login/home
    };

    const pieChartData = [
        { property: "Claimed", value: 575 },
        { property: "Unclaimed", value: 788 },
        { property: "Waived", value: 92 }
    ]

    const barChartData = [
        { dayOfWeek: "Tuesday", dish1: "Burger Steak", dish2: "", Claimed: 420, Unclaimed: 1503 },
        { dayOfWeek: "Wednesday", dish1: "Menudo", dish2: "Adobo", Claimed: 100, Unclaimed: 2175 },
        { dayOfWeek: "Thursday", dish1: "Fried Chicken", dish2: "Ampalaya", Claimed: 200, Unclaimed: 1863 },
        { dayOfWeek: "Friday", dish1: "Tortang Talong", dish2: "Ampalaya", Claimed: 632, Unclaimed: 1698 },
        { dayOfWeek: "Saturday", dish1: "Hotdog", dish2: "Egg", Claimed: 0, Unclaimed: 423 },
    ]

    const trendsData = [
        { dataSpan: "Jan", "Pre-packed Food": 200, "Customized Order": 200, "Unused vouchers": 300 },
        { dataSpan: "Feb", "Pre-packed Food": 1300, "Customized Order": 300, "Unused vouchers": 100 },
        { dataSpan: "Mar", "Pre-packed Food": 1200, "Customized Order": 100, "Unused vouchers": 500 },
        { dataSpan: "Apr", "Pre-packed Food": 900, "Customized Order": 50, "Unused vouchers": 50 },
    ]

    const upcomingEvents = [
        { link: "#", title: "Teachers' Day", date: "Oct 5, 2025" },
        { link: "#", title: "President' Day", date: "Nov 25, 2025" },
        { link: "#", title: "College Intramurals", date: "Dec 15, 2025" }
    ]

    const recentClaims = [
        { id: 1, name: "Santos, Mark Joseph", avatarUrl: "https://randomuser.me/api/portraits/lego/3.jpg", cohort: "BSIS-4" },
        { id: 1, name: "Santos, Mark Joseph", avatarUrl: "https://randomuser.me/api/portraits/lego/3.jpg", cohort: "BSIS-4" },
        { id: 1, name: "Santos, Mark Joseph", avatarUrl: "https://randomuser.me/api/portraits/lego/3.jpg", cohort: "BSIS-4" },
        { id: 1, name: "Santos, Mark Joseph", avatarUrl: "https://randomuser.me/api/portraits/lego/3.jpg", cohort: "BSIS-4" },
        { id: 1, name: "Santos, Mark Joseph", avatarUrl: "https://randomuser.me/api/portraits/lego/3.jpg", cohort: "BSIS-4" },
        { id: 1, name: "Santos, Mark Joseph", avatarUrl: "https://randomuser.me/api/portraits/lego/3.jpg", cohort: "BSIS-4" },
    ]

    const programStatus = [
        {
            program: "Preschool",
            claimed: 12,
            unclaimed: 11,
            waived: 0
        },
        {
            program: "Primary Education",
            claimed: 34,
            unclaimed: 104,
            waived: 4
        },
        {
            program: "Intermediate",
            claimed: 52,
            unclaimed: 113,
            waived: 12
        },
        {
            program: "Junior High School",
            claimed: 112,
            unclaimed: 161,
            waived: 23
        },
        {
            program: "Senior High School",
            claimed: 124,
            unclaimed: 247,
            waived: 37
        },
        {
            program: "Higher Education",
            claimed: 241,
            unclaimed: 152,
            waived: 16
        }
    ];


    return (
        <>
            <div
                style={{
                    backgroundColor: "#F7F9F9",
                    marginBottom: "30px"
                }}
                className="w-full h-auto flex flex-col justify-start">
                {/*HEADER*/}
                <div
                    style={{
                        height: '60px',
                    }}
                    className="w-full flex flex-col">
                    <div
                        style={{
                            paddingLeft: '10px',
                            background: "white",
                            boxShadow: "0 10px 24px 0 rgba(214, 221, 224, 0.32)"
                        }}
                        className="flex-1 flex items-center gap-4 justify-between"
                    >
                        <div className="w-auto h-auto flex gap-4">
                            <div className="w-auto h-auto">
                                <Menu size={20} onClick={handleToggleSidebar} className="hover:cursor-pointer" />
                            </div>
                            <p
                                style={{ fontWeight: '500' }}
                                className="font-geist text-[2vh]"> Dashboard
                            </p>
                        </div>

                        <div
                            style={{
                                marginRight: "20px"
                            }}
                            className="w-auto h-auto flex flex-row gap-5 items-center">
                            <div
                                style={{
                                    margin: "0px 15px 0px 0px",
                                    padding: 5,
                                    borderRadius: 14
                                }}
                                className="bg-[#D9D9D9] w-auto h-full flex items-center">
                                <RiNotification2Fill size={20} />
                            </div>
                            <div>
                                <div className="w-[100%] h-[100%] flex flex-col items-center">
                                    <span
                                        style={{
                                            fontFamily: "geist",
                                            color: "#000",
                                            fontWeight: "500",
                                            fontSize: 14,
                                        }}
                                    >
                                        Name Surname
                                    </span>
                                    <p
                                        style={{
                                            fontFamily: "geist",
                                            color: "#B1AFB0",
                                            fontWeight: "500",
                                            fontSize: 11,
                                        }}
                                        className="w-[100%] flex justify-end"
                                    >Role</p>
                                </div>
                            </div>
                            <div className="w-auto h-auto">
                                <img style={{ height: 33, width: 35, borderRadius: 15 }} src={USER_AVATAR} alt="User Avatar" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* CONTENT */}
                <div className="h-full w-full">

                    <div className="grid grid-cols-[20%_48%_28.5%] gap-4" style={{ margin: 15 }}>
                        <div className="h-full">
                            <CustomStatsCard title={"Daily Virtual Credit Used"} value={"P60,000"} subtitle={"vs P65,000 allotted"} />
                        </div>

                        <div className="">
                            <StatsCardGroup
                                title1={"Accepted Request Rate"}
                                title2={"Accepted Request Count"}
                                title5={"Total Eligible Students"}
                                subtitle1={"Overall"}
                                subtitle2={"Today"}
                                subtitle5={"Today"}
                                value1={100}
                                value2={34}
                                value5={1500}
                                acceptanceRate1={95}
                                expectingPostiveResult1={true}
                                isPercentage={true}

                                title3={"Rejected Request Rate"}
                                title4={"Rejected Request Count"}
                                title6={"Total Waived Students"}
                                subtitle3={"Overall"}
                                subtitle4={"Today"}
                                subtitle6={"Today"}
                                value3={0}
                                value4={0}
                                value6={0}
                                acceptanceRate2={5}
                                expectingPostiveResult2={false}
                            />
                        </div>
                        <div className="">
                            <QuickActions />
                        </div>
                    </div>
                    <div
                        style={{
                            borderRadius: '10px',
                            marginTop: '20px',
                            marginLeft: '40px',
                            marginRight: '40px',
                            backgroundColor: "#F7F9F9"
                        }}
                        className="w-auto bg-white grid grid-cols-[70%_30%] gap-4">
                        <div className="w-full h-auto flex flex-col gap-4">

                            <AnalyticTabs>
                                <div className="w-[100%] flex flex-col items-center h-[100%] bg-[#FFFFFF]">

                                    <div className="flex h-full w-[98%] border-[#D9D9D9] border-[1px]" style={{ marginTop: 10, marginBottom: 10, borderRadius: 10 }}>
                                        <div className="w-[25%] h-auto flex items-center justify-center" style={{ paddingTop: 40, paddingBottom: 40, marginLeft: 20 }}>
                                            <CustomStatsCard title={"Average Student Spending"} value={61} subtitle={"Today"} isPeso={true} isHasAcceptableRange={true} acceptableRate={[58, 62]} />
                                        </div>
                                        <div className="h-[100%] w-[75%] flex justify-end items-center">
                                            <BandedChartTADMC />
                                        </div>
                                    </div>

                                    <div className="flex h-full w-[98%] border-[#D9D9D9] border-[1px]" style={{ marginBottom: 10, borderRadius: 10 }}>
                                        <div className="w-[25%] h-auto flex items-center justify-center" style={{ paddingTop: 40, paddingBottom: 40, marginLeft: 20, paddingRight: 10, paddingLeft: 10 }}>
                                            <CustomStatsCard title={"Credit Utilization Rate"} value={95} subtitle={"Today"} isPeso={false} isPercentage={true} isHasAcceptableRange={true} acceptableRate={[90, 100]} />
                                        </div>
                                        <div className="h-[100%] w-[75%] flex justify-end items-center">
                                            <BandedChartCUR />
                                        </div>
                                    </div>

                                    <div className="flex h-full w-[98%] border-[#D9D9D9] border-[1px]" style={{ marginBottom: 10, borderRadius: 10 }}>
                                        <div className="w-[25%] h-auto flex items-center justify-center" style={{ paddingTop: 40, paddingBottom: 40, marginLeft: 20, paddingRight: 10, paddingLeft: 10 }}>
                                            <CustomStatsCard title={"Overclaim Frequency"} value={7} subtitle={"Today"} isPeso={false} isPercentage={true} isHasAcceptableRange={true} acceptableRate={[0, 15]} />
                                        </div>
                                        <div className="h-[100%] w-[75%] flex justify-end items-center">
                                            <BandedChartOCF />
                                        </div>
                                    </div>

                                    <div className="flex h-full w-[98%] border-[#D9D9D9] border-[1px]" style={{ marginBottom: 10, borderRadius: 10 }}>
                                        <div className="w-[25%] h-auto flex items-center justify-center" style={{ paddingTop: 40, paddingBottom: 40, marginLeft: 20, paddingRight: 10, paddingLeft: 10 }}>
                                            <CustomStatsCard title={"Dish Claims Today"} value={100} subtitle={"Today's Meal: Adobo"} isPeso={false} isPercentage={false} isHasAcceptableRange={false} />
                                        </div>
                                        <div className="h-[100%] w-[75%] flex justify-end items-center">
                                            <BarChartBox data={barChartData} />
                                        </div>
                                    </div>

                                    <div className="flex h-full w-[98%] border-[#D9D9D9] border-[1px]" style={{ marginBottom: 10, borderRadius: 10 }}>
                                        <div className="w-[25%] h-auto flex items-center justify-center" style={{ paddingTop: 40, paddingBottom: 40, marginLeft: 20, paddingRight: 10, paddingLeft: 10 }}>
                                            <CustomStatsCard title={"Unclaim Count"} value={100} subtitle={"Today"} isPeso={false} isPercentage={false} isHasAcceptableRange={false} />
                                        </div>
                                        <div className="h-[100%] w-[75%] flex justify-end items-center">
                                            <LineChartBox data={trendsData} />
                                        </div>
                                    </div>

                                </div>
                            </AnalyticTabs>
                        </div>


                        <div className="h-auto flex flex-col gap-4">

                            <div>
                                <EventsPanel events={upcomingEvents} />
                            </div>
                            <div>
                                <MealAllowanceCard />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}