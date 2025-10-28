import { logout } from "../../functions/logoutAuth";
import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Ticket,
    CalendarDays,
    ShoppingBag,
    BookOpen,
    LogOut,
} from "lucide-react";
import logo from "/lv-logo.svg";



// Sidebar Item Component
const SidebarItem = ({ icon, text, expanded, active, onClick, index }) => {
    return (
        <div
            onClick={() => onClick(index)}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                margin: "0 0.75rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                transition: "all 200ms ease",
                backgroundColor: active ? "white" : "transparent",
                color: active ? "#2b1677" : "#e5e7eb",
                position: "relative",
                zIndex: 1, // Keeps text above highlight animation
            }}
            onMouseEnter={(e) => {
                if (!active) {
                    e.currentTarget.style.backgroundColor = "#52728F";
                    e.currentTarget.style.color = "white";
                }
            }}
            onMouseLeave={(e) => {
                if (!active) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#e5e7eb";
                }
            }}
        >
            {icon}
            {expanded && (
                <span
                    style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        ...(active
                            ? {
                                background: "linear-gradient(to right, #263C70, #4973D6)",
                                WebkitBackgroundClip: "text",
                                color: "transparent",
                            }
                            : {}),
                    }}
                >
                    {text}
                </span>
            )}
        </div>
    );
};


// Sidebar with Animated Indicator
const Sidebar = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // redirect to login/home
    };

    const [isExpanded, setIsExpanded] = useState(true);
    const [activeIndex, setActiveIndex] = useState(1);
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const containerRef = useRef(null);

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, text: "Dashboard" },
        { icon: <Ticket size={20} />, text: "Voucher Management" },
        { icon: <CalendarDays size={20} />, text: "Schedule of Student Eligibility" },
        { icon: <ShoppingBag size={20} />, text: "Meal Recipient Orders" },
        { icon: <BookOpen size={20} />, text: "Records" },
    ];

    useEffect(() => {
        const container = containerRef.current;
        if (container && container.children[activeIndex]) {
            const activeItem = container.children[activeIndex];
            const { offsetTop, offsetHeight } = activeItem;
            setIndicatorStyle({
                top: offsetTop + 4 + "px",
                height: offsetHeight - 8 + "px",
                transition: "top 0.3s ease",
            });
        }
    }, [activeIndex, isExpanded]);

    return (
        <div
            style={{
                display: "flex", // Place sidebar and content side by side
                width: "100%",
                height: "100vh",
                overflow: "hidden",
            }}
        >
            {/* Sidebar */}
            <div
                style={{
                    width: isExpanded ? "288px" : "72px",
                    height: "100vh",
                    background: "linear-gradient(to bottom, #263C70, #142345)",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "width 300ms ease",
                    position: "relative",
                }}
            >
                <div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "1rem",
                            marginBottom: "1.5rem",
                        }}
                    >
                        <img
                            src={logo}
                            alt="Logo"
                            style={{
                                width: isExpanded ? "3.5rem" : "2.5rem",
                                height: isExpanded ? "3.5rem" : "2.5rem",
                                transition: "all 300ms ease",
                            }}
                        />
                    </div>

                    <nav
                        style={{
                            marginTop: "0.5rem",
                            position: "relative",
                            overflow: "visible",
                        }}
                        ref={containerRef}
                    >
                        {menuItems.map((item, i) => (
                            <SidebarItem
                                key={i}
                                index={i}
                                icon={item.icon}
                                text={item.text}
                                expanded={isExpanded}
                                active={activeIndex === i}
                                onClick={setActiveIndex}
                            />
                        ))}
                    </nav>
                </div>

                <div style={{ padding: "1rem" }}>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        style={{
                            position: "relative",
                            right: "-12px",
                            backgroundColor: "#3a24a0",
                            color: "white",
                            padding: "0.25rem",
                            borderRadius: "9999px",
                            transition: "all 300ms ease",
                            border: "none",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#4b34c9")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#3a24a0")
                        }
                    >
                        {isExpanded ? "<" : ">"}
                    </button>

                    <button
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            gap: "0.5rem",
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                            paddingTop: "0.75rem",
                            paddingBottom: "0.75rem",
                            borderRadius: "0.5rem",
                            transition: "all 150ms ease",
                            cursor: "pointer",
                            border: "none",
                        }}
                        onClick={handleLogout}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#52728F")
                        }
                        onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                            "rgba(255, 255, 255, 0.3)")
                        }
                    >
                        <LogOut size={18} />
                        {isExpanded && (
                            <span style={{ fontSize: "0.875rem" }}>Logout</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}

            <div
                style={{
                    flexGrow: 1, // Fill remaining space beside sidebar
                    backgroundColor: "#f9fafb", // optional light background
                    padding: "2rem",
                    overflowY: "auto",
                }}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default Sidebar;
