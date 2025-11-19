import { logout } from "../../../functions/logoutAuth";
import { useState, useRef, useEffect } from "react";
// CHANGE 1: Import useLocation
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useBreakpoint } from "use-breakpoint";
import logo from "/lv-logo.svg";
import { SidebarItem } from "../../../components/custom/SidebarItem";

function Sidebar({ menuItems }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [indicatorStyle, setIndicatorStyle] = useState({});

    const containerRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation(); // Get current URL

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleToggleSidebar = () => {
        setIsExpanded(!isExpanded)
    }

    // CHANGE 2: Sync activeIndex with the URL
    // This ensures that on refresh, the sidebar highlights the correct page
    useEffect(() => {
        const currentPath = location.pathname;
        // Find index of item where the path matches the current URL
        // You might need to adjust logic if you use nested routes (e.g., use .startsWith)
        const activeItemIndex = menuItems.findIndex(item => currentPath.includes(item.path));

        if (activeItemIndex !== -1) {
            setActiveIndex(activeItemIndex);
        }
    }, [location, menuItems]);

    // CHANGE 3: Handle Click to Navigate
    const handleItemClick = (index) => {
        setActiveIndex(index); // Update visual state immediately
        navigate(menuItems[index].path); // Navigate to the URL
    };

    // ... (Your existing Indicator logic remains the same) ...
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

    const BREAKPOINTS = {
        'mobile-md': 375,
        'mobile-lg': 425,
        'tablet': 768,
        'laptop-md': 1024,
        'laptop-lg': 1440,
    };

    const { breakpoint } = useBreakpoint(BREAKPOINTS, 'mobile-md');

    return (
        <>
            <div style={{ display: "flex", width: "100%", height: "100vh", overflow: "hidden", backgroundColor: "#F4FDFF" }}>
                {/* Sidebar */}
                <div style={{
                    width: isExpanded ? "300px" : "72px",
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
                        {/* Header/Logo Area (Kept same as your code) */}
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem", marginBottom: "1.5rem" }}>
                            <img src={logo} alt="Logo" style={{ width: isExpanded ? "3.5rem" : "2.5rem", height: isExpanded ? "3.5rem" : "2.5rem", transition: "all 300ms ease" }} />
                            {isExpanded && (
                                <div style={{ marginLeft: '10px' }} className="h-auto w-auto flex flex-col justify-center gap-0">
                                    <p style={{ fontWeight: "bold" }} className="font-geist text-[2.3vh] h-auto flex items-end">Eat's on Tap</p>
                                    <p style={{ fontWeight: 'regular' }} className="font-geist text-[2vh] h-auto flex items-start">La Verdad Christian College</p>
                                </div>
                            )}
                        </div>

                        {/* Navigation Items */}


                        {menuItems.map((item, i) => (
                            <SidebarItem
                                key={i}
                                index={i}
                                icon={item.icon}
                                text={item.text}
                                expanded={isExpanded}
                                active={activeIndex === i}
                                // CHANGE 3b: Pass the new handler
                                onClick={() => handleItemClick(i)}
                            />
                        ))}

                    </div>

                    {/* Logout Button Area */}
                    <div style={{ padding: "1rem" }}>
                        <button
                            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", gap: "0.5rem", backgroundColor: "rgba(255, 255, 255, 0.3)", paddingTop: "0.75rem", paddingBottom: "0.75rem", borderRadius: "0.5rem", transition: "all 150ms ease", cursor: "pointer", border: "none" }}
                            onClick={handleLogout}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#52728F")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)")}
                        >
                            <LogOut size={18} />
                            {isExpanded && <span style={{ fontSize: "0.875rem" }}>Logout</span>}
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div style={{ flexGrow: 1, backgroundColor: "#f9fafb", overflowY: "auto" }}>
                    <Outlet context={{ handleToggleSidebar }} />
                </div>
            </div>
        </>
    )
}

export { Sidebar }