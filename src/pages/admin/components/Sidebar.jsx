import { logout } from "../../../functions/logoutAuth";
import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useBreakpoint } from "use-breakpoint";
import logo from "/lv-logo.svg";
import { SidebarItem } from "../../../components/custom/SidebarItem"; // Assuming the fixed version is here
import { Tooltip } from "flowbite-react";

function Sidebar({ menuItems }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [indicatorStyle, setIndicatorStyle] = useState({ top: '0px', height: '0px', opacity: 0 });

    const containerRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleToggleSidebar = () => {
        setIsExpanded(!isExpanded)
    }

    // Sync activeIndex with the URL
    useEffect(() => {
        const currentPath = location.pathname;
        const activeItemIndex = menuItems.findIndex(item => currentPath.includes(item.path));

        if (activeItemIndex !== -1 && activeItemIndex !== activeIndex) {
            setActiveIndex(activeItemIndex);
        }
    }, [location, menuItems, activeIndex]);

    // Handle Click to Navigate
    const handleItemClick = (index) => {
        setActiveIndex(index);
        navigate(menuItems[index].path);
    };

    // --- INDICATOR POSITIONING LOGIC (Using getBoundingClientRect for reliability) ---
    useEffect(() => {
        const container = containerRef.current;
        // The children of the <nav> container are the Indicator (index 0) and the SidebarItems (index 1 onwards)
        const activeItem = container?.children[activeIndex + 1];

        if (container && activeItem) {
            // Use getBoundingClientRect for accurate measurement
            const containerRect = container.getBoundingClientRect();
            const activeRect = activeItem.getBoundingClientRect();

            // Calculate position relative to the container
            const newTop = activeRect.top - containerRect.top;
            const newHeight = activeRect.height;

            // Your original code subtracted and added a fixed pixel offset. 
            // I'm using the pure rect values for a tighter fit. If you need padding around 
            // the indicator, let me know the exact vertical padding of the SidebarItem.
            setIndicatorStyle({
                top: newTop + "px",
                height: newHeight + "px",
                opacity: 1,
            });
        } else {
            setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
        }

    }, [activeIndex, isExpanded, menuItems.length]);

    // --- Vertical Indicator Component ---
    const Indicator = () => {
        const margin = isExpanded ? '0.75rem' : '0.25rem'; // Matches SidebarItem's dynamic horizontal margin

        const style = {
            position: "absolute",
            left: margin,
            width: `calc(100% - (${margin} * 2))`, // 100% minus both left and right margins
            backgroundColor: "white",
            borderRadius: "0.5rem",
            zIndex: 0,
            transition: "top 0.3s ease, height 0.3s ease", // Smooth transition for sliding
            ...indicatorStyle, // Applies top, height, and opacity
        };

        return <div style={style} />;
    }

    const BREAKPOINTS = {
        'mobile-md': 375, 'mobile-lg': 425, 'tablet': 768,
        'laptop-md': 1024, 'laptop-lg': 1440,
    };

    const { breakpoint } = useBreakpoint(BREAKPOINTS, 'mobile-md');

    // Define the expanded and collapsed widths
    const sidebarWidth = isExpanded ? "280px" : "72px";
    const transitionDuration = "300ms"; // Reuse transition duration

    return (
        // --- Parent Container (Full Viewport Wrapper) ---
        <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#F4FDFF" }}>

            {/* 1. Sidebar (FIXED Position) */}
            <div style={{
                width: sidebarWidth, // Transitioning width
                height: "100vh",
                background: "linear-gradient(to bottom, #153FA3, #142345)",
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: `width ${transitionDuration} ease`,

                // *** NEW STYLES FOR FLOATING EFFECT ***
                position: "fixed", // Key change to take it out of document flow
                top: 0,
                left: 0,
                zIndex: 1000, // Ensure it floats above all main content
                // ************************************

            }}
            >
                <div>
                    {/* Header/Logo Area */}
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem", marginBottom: "1.5rem" }}>
                        <img src={logo} alt="Logo" style={{ width: isExpanded ? "3.5rem" : "2.5rem", height: isExpanded ? "3.5rem" : "2.5rem", transition: "all 300ms ease" }} />
                        {isExpanded && (
                            <div style={{ marginLeft: '10px' }} className="h-auto w-auto flex flex-col justify-center gap-0">
                                <p style={{ fontWeight: "bold" }} className="font-geist text-[2.3vh] h-auto flex items-end">Eat's on Tap</p>
                                <p style={{ fontWeight: 'regular' }} className="font-tolkien text-[1.5vh] h-auto flex items-start">LA VERDAD CHRISTIAN COLLEGE</p>
                            </div>
                        )}
                    </div>

                    {/* Navigation Items */}
                    <nav
                        style={{
                            marginTop: "0.5rem",
                            position: "relative",
                            overflow: "visible",
                        }}
                        ref={containerRef}
                    >
                        <Indicator />

                        {menuItems.map((item, i) => (
                            <Tooltip content={<p className="font-geist w-[120px]" style={{ padding: "10px 15px" }}>{item.text}</p>} placement="right" trigger="hover" style="light" animation="duration-200">
                                <SidebarItem
                                    key={i}
                                    index={i}
                                    icon={item.icon}
                                    text={item.text}
                                    expanded={isExpanded}
                                    active={activeIndex === i}
                                    onClick={handleItemClick}
                                />
                            </Tooltip>
                        ))}
                    </nav>
                </div>

                {/* Footer Buttons (Toggle and Logout) */}
                <div style={{ padding: "1rem" }}>
                    {/* Toggle Button (REMOVED ABSOLUTE POSITIONING) */}
                    {/* <button
                        onClick={handleToggleSidebar}
                        style={{
                            display: "block",
                            margin: isExpanded ? "0 auto 1rem 0" : "0 auto 1rem auto", // Adjusted margin
                            backgroundColor: "#3a24a0",
                            color: "white",
                            padding: "0.25rem",
                            borderRadius: "9999px",
                            transition: "all 300ms ease",
                            border: "none",
                            cursor: "pointer",
                            zIndex: 10,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4b34c9")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3a24a0")}
                    >
                        {isExpanded ? "<" : ">"}
                    </button> */}

                    {/* Logout Button */}
                    <button
                        style={{
                            display: "flex", alignItems: "center",
                            justifyContent: isExpanded ? "flex-start" : "center",
                            width: "100%", gap: "0.5rem",
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                            paddingTop: "0.75rem", paddingBottom: "0.75rem",
                            borderRadius: "0.5rem", transition: "all 150ms ease",
                            cursor: "pointer", border: "none",
                            paddingLeft: isExpanded ? "1rem" : undefined
                        }}
                        onClick={handleLogout}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#52728F")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)")}
                    >
                        <LogOut size={18} />
                        {isExpanded && <span style={{ fontSize: "0.875rem" }}>Logout</span>}
                    </button>
                </div>
            </div>

            {/* 2. Main Content Area (Wrapper to push content right) */}
            <div
                style={{
                    // *** NEW STYLES FOR CONTENT DISPLACEMENT ***
                    marginLeft: sidebarWidth, // Pushes content away from the fixed sidebar
                    transition: `margin-left ${transitionDuration} ease`, // Matches sidebar's transition
                    width: `calc(100% - ${sidebarWidth})`, // Occupy remaining space
                    // ************************************

                    flexGrow: 1, // Retained for compatibility with a flex child if parent were flex
                    backgroundColor: "#f9fafb",
                    minHeight: "100vh", // Use min-height since the parent is no longer a fixed 100vh flex container
                    overflowY: "auto",
                }}
            >
                <Outlet context={{ handleToggleSidebar }} />
            </div>
        </div>
    );
}

export { Sidebar };