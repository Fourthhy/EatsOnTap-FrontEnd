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
        { name: "Claimed", value: 1280 },
        { name: "Unclaimed", value: 420 },
        { name: "Waived", value: 132 }
    ]

    const barChartData = [
        { dish: "Miswa / Monggo", Claimed: 2200, Unclaimed: 200 },
        { dish: "Burger Steak", Claimed: 1603, Unclaimed: 429 },
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
                className="w-full h-[100vh] flex flex-col justify-start overflow-hidden">
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
                <div className="h-[85vh] w-full">
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
                        </div>
                        <div>
                            <QuickActions />
                        </div>


                    </div>
                </div>
            </div>
            <div style={{ display: "flex", minHeight: "100vh", background: "#F9FBFC" }}>
                {/* Left Sidebar */}
                {/* <aside style={{ width: "72px", background: "#183A6D", padding: "24px 0" }}>
                    <img src={SCHOOL_LOGO} alt="School Logo" style={{ width: 48, borderRadius: "50%", margin: "0 auto" }} />
                </aside> */}


                {/* Main Content */}
                <main style={{ flexGrow: 1, padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>

                        {/* Header */}
                        <div>
                            <h1 style={{ margin: 0 }}>Good Morning!</h1>
                            <small>Here's everything you need to know!</small>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                            <img src={USER_AVATAR} alt="User" style={{ width: 32, borderRadius: "50%" }} />

                            <div>
                                {/* <span style={{ fontWeight: "bold" }}>{data.user.name}</span> */}
                                <span style={{ fontWeight: "bold" }}>Sample User Name</span>
                                <br />
                                <span style={{ fontSize: 12, color: "#777" }}>Admin</span>
                            </div>

                        </div>
                    </div>

                    {/* Top Stats Row */}
                    <section style={{ display: "flex", gap: 24, marginTop: 32 }}>
                        {/* <StatsCard title="Total Claims (Today)" value={data.claimsToday} subtitle={data.claimsChange} />
                        <StatsCard title="Eligible (Today)" value={data.eligibleToday} subtitle={data.eligibleChange} />
                        <StatsCard title="Virtual Credit Used" value={`₱${data.creditUsed.toLocaleString()}`} subtitle={data.creditSubtitle} />
                        <StatsCard title="Waived Meals" value={data.waivedMeals} subtitle={data.waivedChange} /> */}
                        <StatsCard title="Total Claims (Today)" value={252} subtitle={"12% vs yesterday"} />
                        <StatsCard title="Eligible (Today)" value={1380} subtitle={"320 not eligible"} />
                        <StatsCard title="Virtual Credit Used" value={"₱34,500"} subtitle={"Daily 60-pesos credit"} />
                        <StatsCard title="Waived Meals" value={92} subtitle={"12 yesterday"} />
                    </section>

                    <section style={{ display: "flex", gap: 24, marginTop: 24 }}>
                        {/* Left Column - Claims Table & Pie */}
                        <div style={{ flex: 2 }}>
                            <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 2px 8px #eee" }}>
                                {/* Program Status Table & Pie */}
                                <div style={{ display: "flex", gap: 24 }}>
                                    <table style={{ flex: 1, fontSize: 14 }}>
                                        <thead>
                                            <tr><th></th><th>Claimed</th><th>Unclaimed</th><th>Waived</th></tr>
                                        </thead>
                                        <tbody>
                                            {programStatus.map(row => (
                                                <tr key={row.program}>
                                                    <td>{row.program}</td>
                                                    <td style={{ color: "#16B67A" }}>{row.claimed}</td>
                                                    <td style={{ color: "#FF5757" }}>{row.unclaimed}</td>
                                                    <td style={{ color: "#B8B8B8" }}>{row.waived ?? "-"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <PieChartBox data={pieChartData} />
                                </div>
                            </div>

                            {/* Week Count Bar Chart */}
                            <BarChartBox data={barChartData} />

                            {/* Trends Line Chart */}
                            <LineChartBox data={trendsData} />
                        </div>

                        {/* Right Column - Actions, Events, Claims */}
                        <div style={{ flex: 1 }}>
                            <QuickActions />
                            <EventsPanel events={upcomingEvents} />
                            <ClaimsPanel claims={recentClaims} />
                            <div style={{ background: "#fff", marginTop: 12, borderRadius: 8, padding: 16, fontWeight: "bold", fontSize: 18 }}>
                                Default Meal Allowance<br />
                                {/* <span style={{ color: "#16B67A", fontSize: 22 }}>PHP {data.mealAllowance}</span> */}
                                <span style={{ color: "#16B67A", fontSize: 22 }}>PHP {60}</span>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    )
}