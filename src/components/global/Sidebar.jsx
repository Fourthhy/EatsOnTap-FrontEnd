import { logout } from "../../functions/logoutAuth";
import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useBreakpoint } from "use-breakpoint";
import logo from "/lv-logo.svg";
import { SidebarItem } from "../custom/SidebarItem";
import { Tooltip } from "flowbite-react";

function Sidebar({ menuItems }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [indicatorStyle, setIndicatorStyle] = useState({ top: '0px', height: '0px', opacity: 0 });

    const containerRef = useRef(null);
    const itemRefs = useRef([]); // To store references to each menu item
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleToggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    // Sync activeIndex with the URL
    useEffect(() => {
        const currentPath = location.pathname;
        const activeItemIndex = menuItems.findIndex(item => currentPath.includes(item.path));

        if (activeItemIndex !== -1 && activeItemIndex !== activeIndex) {
            setActiveIndex(activeItemIndex);
        }
    }, [location.pathname, menuItems, activeIndex]);

    // Handle Click to Navigate
    const handleItemClick = (index) => {
        setActiveIndex(index);
        navigate(menuItems[index].path);
    };

    // --- INDICATOR POSITIONING LOGIC ---
    useEffect(() => {
        const container = containerRef.current;
        const activeItem = itemRefs.current[activeIndex];

        if (container && activeItem) {
            const containerRect = container.getBoundingClientRect();
            const activeRect = activeItem.getBoundingClientRect();

            setIndicatorStyle({
                top: (activeRect.top - containerRect.top) + "px",
                height: activeRect.height + "px",
                opacity: 1,
            });
        } else {
            setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
        }
    }, [activeIndex, isExpanded, menuItems.length]);

    const BREAKPOINTS = {
        'mobile-md': 375, 'mobile-lg': 425, 'tablet': 768,
        'laptop-md': 1024, 'laptop-lg': 1440,
    };

    const { breakpoint } = useBreakpoint(BREAKPOINTS, 'mobile-md');

    const sidebarWidth = isExpanded ? "280px" : "72px";
    const transitionDuration = "300ms";
    const indicatorMargin = isExpanded ? '0.75rem' : '0.25rem';

    return (
        <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#F4FDFF" }}>

            {/* 1. Sidebar */}
            <div style={{
                width: sidebarWidth,
                height: "100vh",
                background: "linear-gradient(to bottom, #2CA4DD, #143463)",
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: `width ${transitionDuration} ease`,
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 1000,
            }}>
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
                        {/* Inline Indicator for smoother transitions */}
                        <div style={{
                            position: "absolute",
                            left: indicatorMargin,
                            width: `calc(100% - (${indicatorMargin} * 2))`,
                            backgroundColor: "white",
                            borderRadius: "0.5rem",
                            zIndex: 0,
                            transition: "top 0.3s ease, height 0.3s ease, left 0.3s ease, width 0.3s ease",
                            ...indicatorStyle,
                        }} />

                        {menuItems.map((item, i) => (
                            <Tooltip
                                key={i}
                                content={<p className="font-geist w-[120px]" style={{ padding: "10px 15px" }}>{item.text}</p>}
                                placement="right"
                                trigger={isExpanded ? "none" : "hover"}
                                style="light"
                                animation="duration-300"
                            >
                                {/* Wrapper div with ref to capture exact position */}
                                <div ref={el => itemRefs.current[i] = el}>
                                    <SidebarItem
                                        index={i}
                                        icon={item.icon}
                                        text={item.text}
                                        expanded={isExpanded}
                                        active={activeIndex === i}
                                        onClick={handleItemClick}
                                    />
                                </div>
                            </Tooltip>
                        ))}
                    </nav>
                </div>

                {/* Footer Buttons */}
                <div style={{ padding: "1rem" }}>
                    <button
                        style={{
                            display: "flex", alignItems: "center",
                            justifyContent: isExpanded ? "flex-start" : "center",
                            width: "100%", gap: "0.5rem",
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                            paddingTop: "0.75rem", paddingBottom: "0.75rem",
                            borderRadius: "0.5rem", transition: "all 100ms ease",
                            cursor: "pointer", border: "none",
                            paddingLeft: isExpanded ? "1rem" : undefined,
                            color: "white"
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

            {/* 2. Main Content Area */}
            <div
                style={{
                    marginLeft: sidebarWidth,
                    transition: `margin-left ${transitionDuration} ease`,
                    width: `calc(100% - ${sidebarWidth})`,
                    backgroundColor: "#f9fafb",
                    minHeight: "100vh",
                    overflowY: "auto",
                }}
            >
                <Outlet context={{ handleToggleSidebar }} />
            </div>
        </div>
    );
}

export { Sidebar };