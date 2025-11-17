import { logout } from "../../functions/logoutAuth"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"
import { StatsCardGroup } from "./components/StatsCardGroup"
import { PieChartBox } from "./components/PieChartBox";
import { BarChartBox } from "./components/BarChartBox";
import { LineChartBox } from "./components/LineChartBox";
import { QuickActions } from "./components/QuickActions";
import { EventsPanel } from "./components/EventsPanel";
import { ClaimsPanel } from "./components/ClaimsPanel";
import { AnalyticTabs } from "./components/FluidTab";
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
        { dayOfWeek: "Monday", dish1: "Miswa", dish2: "Monggo", Claimed: 210, Unclaimed: 2100 },
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
        { dataSpan: "May", "Pre-packed Food": 1000, "Customized Order": 300, "Unused vouchers": 300 },
        { dataSpan: "Jun", "Pre-packed Food": 500, "Customized Order": 500, "Unused vouchers": 200 },
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



                            <div className="grid grid-cols-5 gap-4">

                                <div className="col-span-3">
                                    <StatsCardGroup
                                        title1={"Accepted Request Rate"}
                                        title2={"Accepted Request Count"}
                                        subtitle1={"Overall"}
                                        subtitle2={"Today"}
                                        value1={100}
                                        value2={34}
                                        acceptanceRate1={95}
                                        expectingPostiveResult1={true}
                                        isPercentage={true}

                                        title3={"Rejected Request Rate"}
                                        title4={"Rejected Request Count"}
                                        subtitle3={"Overall"}
                                        subtitle4={"Today"}
                                        value3={0}
                                        value4={0}
                                        acceptanceRate2={5}
                                        expectingPostiveResult2={false}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <QuickActions />
                                </div>

                                {/* <div className="col-span-1 h-full">
                                    <GreetingCard subtitle={"Here’s everything you need to know!"} />
                                </div> */}

                            </div>

                            <AnalyticTabs />


                            <div className="w-full h-auto mx-auto mt-8 bg-white shadow rounded-lg flex">


                                <div
                                    style={{
                                        marginRight: 6,
                                        marginLeft: 10,
                                    }}
                                    className="w-[60%] min-h-full flex flex-col justify-center">
                                    <div
                                        style={{ padding: "15px 4px 10px 10px " }}>
                                        <h2
                                            style={{
                                                color: '#4C4B4B',
                                                fontWeight: '500',
                                                fontSize: 13
                                            }}>
                                            Program Status Claim (Today)
                                        </h2>
                                    </div>

                                    <table
                                        style={{ marginBottom: "10px" }}
                                        className="min-w-full min-h-auto border-gray-200 border-[1px]">
                                        <thead className="border-gray-200 border-[1px] bg-[#FCFCFD]">
                                            <tr className="bg-gray-50 text-gray-700">
                                                <th
                                                    style={{
                                                        padding: "10px 2px 10px 10px",
                                                        fontSize: 14,
                                                        color: "#667085"
                                                    }}
                                                    className="text-left font-medium">
                                                    All
                                                </th>
                                                <th
                                                    style={{
                                                        padding: "10px 2px 10px 2px",
                                                        fontSize: 14,
                                                        color: "#076560"
                                                    }}
                                                    className="text-left font-medium">
                                                    Claimed
                                                </th>
                                                <th
                                                    style={{
                                                        padding: "10px 2px 10px 2px",
                                                        fontSize: 14,
                                                        color: "#CF7171"
                                                    }}
                                                    className="text-left font-medium">
                                                    Unclaimed
                                                </th>
                                                <th
                                                    style={{
                                                        padding: "10px 2px 10px 2px",
                                                        fontSize: 14,
                                                        color: "#9291A5"
                                                    }}
                                                    className="text-left font-medium">
                                                    Waived
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {programStatus.map((item, idx) => (
                                                <tr key={item.category} className="border-b last:border-none">
                                                    <td
                                                        style={{
                                                            padding: "10px 2px 10px 10px",
                                                            fontSize: 13
                                                        }}
                                                        className="font-geist">
                                                        {item.program}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "10px 2px 10px 2px",
                                                            fontSize: 14,
                                                            fontWeight: '500',
                                                            color: "#076560"
                                                        }}
                                                        className="font-geist">
                                                        {item.claimed}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "10px 2px 10px 2px",
                                                            fontSize: 14,
                                                            fontWeight: '500',
                                                            color: "#CF7171"
                                                        }}
                                                        className="font-geist">
                                                        {item.unclaimed}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "10px 2px 10px 2px",
                                                            fontSize: 14,
                                                            fontWeight: '500',
                                                            color: "#9291A5"
                                                        }}
                                                        className="font-geist">
                                                        {item.waived}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="w-[40%] h-[100%]">
                                    <PieChartBox data={pieChartData} />
                                </div>
                            </div>

                            <div className="w-full h-[45vh] mx-auto bg-white shadow rounded-lg flex">
                                <div className="h-auto w-full">
                                    <BarChartBox data={barChartData} />
                                </div>
                            </div>
                            <div className="w-full h-[45vh] mx-auto bg-white shadow rounded-lg flex">
                                <div className="h-auto w-full">
                                    <LineChartBox data={trendsData} />
                                </div>
                            </div>
                        </div>


                        <div className="h-auto flex flex-col gap-4">
                            <div>
                                <EventsPanel events={upcomingEvents} />
                            </div>
                            <div>
                                <ClaimsPanel claims={recentClaims} />
                            </div>
                            <div>
                                <div
                                    style={{
                                        background: "#fff",
                                        borderRadius: 8,
                                        padding: 16
                                    }}
                                    className="w-full h-auto flex flex-col items-center"
                                >
                                    <span
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: 13,
                                            fontFamily: 'geist',
                                            paddingBottom: "20px"
                                        }}
                                        className="w-full h-auto flex items-center"
                                    >
                                        Default Meal Allowance
                                    </span>
                                    <div
                                        style={{
                                            background: "#E6FBF9",
                                            padding: 10
                                        }}
                                        className="w-full h-auto flex justify-center rounded-lg"
                                    >
                                        <span style={{ color: "#000", fontSize: 20, fontFamily: "geist" }}>PHP {60}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}