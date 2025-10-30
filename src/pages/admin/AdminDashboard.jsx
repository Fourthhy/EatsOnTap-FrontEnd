import { logout } from "../../functions/logoutAuth"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"
import { StatsCard } from "./components/StatsCard";
import { PieChartBox } from "./components/PieChartBox";
import { BarChartBox } from "./components/BarChartBox";
import { LineChartBox } from "./components/LineChartBox";
import { QuickActions } from "./components/QuickActions";
import { EventsPanel } from "./components/EventsPanel";
import { ClaimsPanel } from "./components/ClaimsPanel";
import { GreetingCard } from "./components/GreetingCard";
import { useOutletContext } from 'react-router-dom';
import { Menu } from "lucide-react"

// Example logo API usage
const SCHOOL_LOGO = "https://logo.clearbit.com/up.edu.ph";
const USER_AVATAR = "https://logo.clearbit.com/github.com";

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
        { month: "Jan", "Pre-packed Food": 1500, "Customized Order": 900, "Unused vouchers": 500 }
    ]

    const upcomingEvents = [
        { title: "Teachers' Day", date: "Oct 5, 2025" },
        { title: "President' Day", date: "Nov 25, 2025" },
        { title: "College Intramurals", date: "Dec 15, 2025" }
    ]

    const recentClaims = [
        { id: 1, name: "Santos, Mark Joseph", avatarUrl: "https://logo.clearbit.com/facebook.com", claimId: "854-S" },
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
                style={{ backgroundColor: "#F7F9F9" }}
                className="w-full h-auto flex flex-col justify-start">
                {/*HEADER*/}
                <div
                    style={{ height: '60px' }}
                    className="w-full flex flex-col">
                    <div
                        style={{
                            paddingLeft: '10px',
                            background: "white",
                            boxShadow: "0 10px 24px 0 rgba(214, 221, 224, 0.32)"
                        }}
                        className="flex-1 flex items-center gap-4">
                        <Menu size={20} onClick={handleToggleSidebar} className="hover:cursor-pointer" />
                        <p
                            style={{ fontWeight: '500' }}
                            className="font-geist text-[2vh]"> Eat's on Tap
                        </p>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="h-auto w-full">
                    <div
                        style={{
                            borderRadius: '10px',
                            marginTop: '20px',
                            marginLeft: '40px',
                            marginRight: '40px',
                            boxShadow: "0 10px 24px 0 rgba(214, 221, 224, 0.32)",
                            backgroundColor: "#F7F9F9"
                        }}
                        className="w-auto bg-white grid grid-cols-[70%_30%] gap-4">

                        <div className="w-full h-auto flex flex-col gap-4">

                            <GreetingCard subtitle={"Here’s everything you need to know!"} />

                            <div className="grid grid-cols-4 gap-4">
                                <StatsCard title="Total Claims (Today)" value={252} subtitle={"12% vs yesterday"} />
                                <StatsCard title="Eligible (Today)" value={1380} subtitle={"320 not eligible"} />
                                <StatsCard title="Virtual Credit Used" value={"₱34,500"} subtitle={"Daily 60-pesos credit"} />
                                <StatsCard title="Waived Meals" value={92} subtitle={"12 yesterday"} />
                            </div>

                            <div className="w-full h-[50vh] mx-auto mt-8 bg-white shadow rounded-lg flex">
                                <div
                                    style={{
                                        marginTop: 4,
                                        marginRight: 6,
                                        marginLeft: 10,
                                        marginRight: 6
                                    }}
                                    className="w-[60%]">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h2
                                            style={{
                                                padding: "8px 0px 8px 0px",
                                                color: '#4C4B4B',
                                                fontWeight: '500',
                                                fontSize: 13
                                            }}>
                                            Program Status Claim (Today)
                                        </h2>
                                    </div>
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-700">
                                                <th
                                                    style={{
                                                        padding: "10px 2px 10px 2px",
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
                                                            padding: "10px 2px 10px 2px",
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

                            <div className="w-full h-[50vh] mx-auto mt-8 bg-white shadow rounded-lg flex">
                                <div className="h-auto w-full">
                                    <BarChartBox data={barChartData} />
                                </div>
                            </div>


                        </div>


                        <div>
                            <QuickActions />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", minHeight: "0", background: "#F9FBFC" }}>
                {/* Left Sidebar */}
                {/* <aside style={{ width: "72px", background: "#183A6D", padding: "24px 0" }}>
                    <img src={SCHOOL_LOGO} alt="School Logo" style={{ width: 48, borderRadius: "50%", margin: "0 auto" }} />
                </aside> */}


                {/* Main Content */}
                <main style={{ flexGrow: 1, padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>

                        {/* Header */}
                        {/* <div>
                            <h1 style={{ margin: 0 }}>Good Morning!</h1>
                            <small>Here's everything you need to know!</small>
                        </div> */}

                        {/* <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                            <img src={USER_AVATAR} alt="User" style={{ width: 32, borderRadius: "50%" }} />
                            <div>
                                <span style={{ fontWeight: "bold" }}>Sample User Name</span>
                                <br />
                                <span style={{ fontSize: 12, color: "#777" }}>Admin</span>
                            </div>
                        </div> */}

                    </div>

                    {/* Top Stats Row */}

                    <section style={{ display: "flex", gap: 24, marginTop: 24 }}>
                        {/* Left Column - Claims Table & Pie */}
                        <div style={{ flex: 2 }}>


                            {/* Week Count Bar Chart */}
                            {/* <BarChartBox data={barChartData} /> */}

                            {/* Trends Line Chart */}
                            {/* <LineChartBox data={trendsData} /> */}
                        </div>

                        {/* Right Column - Actions, Events, Claims */}
                        <div style={{ flex: 1 }}>
                            {/* <EventsPanel events={upcomingEvents} />
                            <ClaimsPanel claims={recentClaims} /> */}

                            {/* <div style={{ background: "#fff", marginTop: 12, borderRadius: 8, padding: 16, fontWeight: "bold", fontSize: 18 }}>
                                Default Meal Allowance<br />
                                <span style={{ color: "#16B67A", fontSize: 22 }}>PHP {60}</span>
                            </div> */}

                        </div>
                    </section>
                </main>
            </div>
        </>
    )
}