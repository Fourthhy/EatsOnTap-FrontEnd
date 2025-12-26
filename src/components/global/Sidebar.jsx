import { logout } from "../../functions/logoutAuth";
import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useBreakpoint } from "use-breakpoint";
import logo from "/lv-logo.svg";
import { SidebarItem } from "./SidebarItem";
import { Tooltip } from "flowbite-react";

function Sidebar({ menuItems, menutItemsLabel, quickActions, quickActionsLabel, settingMenu }) {
    const [activeTab, setActiveTab] = useState(menuItems[0]?.text || "");
    const navigate = useNavigate();
    const location = useLocation();

    // --- FIX 1: Initialize state based on current URL to prevent "flash" on refresh ---
    const [onSettings, setOnSettings] = useState(() => 
        location.pathname.includes('/admin/settings')
    );
    
    const [activeIndex, setActiveIndex] = useState(() => {
        const index = menuItems.findIndex(item => location.pathname.includes(item.path));
        // If we found a match, use it. If not, default to 0 only if we aren't on settings.
        return index !== -1 ? index : 0;
    });

    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef(null);
    const itemRefs = useRef([]); 

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleToggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    // --- FIX 2: Update useEffect to explicitly handle Settings path ---
    useEffect(() => {
        const currentPath = location.pathname;
        
        // Check if we are on the Settings page
        if (currentPath.includes('/admin/settings')) {
            setOnSettings(true);
            setActiveIndex(-1); // Deselect main menu items
            return;
        }

        // Check if we are on a Main Menu page
        const activeItemIndex = menuItems.findIndex(item => currentPath.includes(item.path));
        if (activeItemIndex !== -1) {
            setActiveIndex(activeItemIndex);
            setOnSettings(false);
        }
    }, [location.pathname, menuItems]);

    useEffect(() => {
        document.title = `${activeTab} - Eat's on Tap`;
    }, [activeTab])

    // Handle Click to Navigate
    const handleItemClick = (index) => {
        setActiveIndex(index);
        setOnSettings(false);
        navigate(menuItems[index].path);
        setActiveTab(menuItems[index].text);

    };

    // Handle click of settings
    const handleSettingsClick = () => {
        setActiveIndex(-1); // Deselect main menu items
        setOnSettings(true);
        navigate('/admin/settings');
    }

    const BREAKPOINTS = {
        'mobile-md': 375, 'mobile-lg': 425, 'tablet': 768,
        'laptop-md': 1024, 'laptop-lg': 1440,
    };

    const { breakpoint } = useBreakpoint(BREAKPOINTS, 'mobile-md');
    const sidebarWidth = isExpanded ? "288px" : "80px";
    const transitionDuration = "300ms";

    return (
        <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#F4FDFF" }}>
            {/* 1. Sidebar */}
            <div
                style={{
                    width: sidebarWidth,
                    height: "100vh",
                    background: "linear-gradient(to bottom, #153FA3, #142345)",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: `width ${transitionDuration} cubic-bezier(0.4, 0, 0.2, 1)`,
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
                            padding: "0px 4px"
                        }}
                        ref={containerRef}
                    >
                        {quickActionsLabel && isExpanded && (
                            <div style={{ margin: "10px 0", paddingLeft: "1rem" }}>
                                <span className="font-geist" style={{ color: "white", fontSize: "0.8rem", fontWeight: 450 }}>{quickActionsLabel}</span>
                            </div>
                        )}

                        {quickActions && quickActions.map((item, i) => (
                            <Tooltip
                                key={i}
                                content={<p className="font-geist w-[120px]" style={{ padding: "10px 15px" }}>{item.text}</p>}
                                placement="right"
                                trigger={isExpanded ? "none" : "hover"}
                                style="light"
                                animation="duration-300"
                                arrow={false}
                            >
                                <div ref={el => itemRefs.current[i] = el}>
                                    <SidebarItem
                                        icon={item.icon}
                                        text={item.text}
                                        expanded={isExpanded}
                                        active={false}
                                        onClick={item.onClickAction}
                                    />
                                </div>
                            </Tooltip>
                        ))}

                        <div style={{ margin: "10px 0", width: "100%", display: "flex", justifyContent: "center" }}>
                            <hr style={{ width: "90%" }} />
                        </div>

                        {menutItemsLabel && isExpanded && (
                            <div style={{ margin: "10px 0", paddingLeft: "1rem" }}>
                                <span className="font-geist" style={{ color: "white", fontSize: "0.8rem", fontWeight: 450 }}>{menutItemsLabel}</span>
                            </div>
                        )}

                        {menuItems.map((item, i) => (
                            <Tooltip
                                key={i}
                                content={<p className="font-geist w-[120px]" style={{ padding: "10px 15px" }}>{item.text}</p>}
                                placement="right"
                                trigger={isExpanded ? "none" : "hover"}
                                style="light"
                                animation="duration-300"
                            >
                                <div ref={el => itemRefs.current[i] = el}>
                                    <SidebarItem
                                        index={i}
                                        icon={item.icon}
                                        text={item.text}
                                        expanded={isExpanded}
                                        // Ensure item is NOT active if we are on settings
                                        active={!onSettings && activeIndex === i}
                                        onClick={() => handleItemClick(i)}
                                    />
                                </div>
                            </Tooltip>
                        ))}
                    </nav>
                </div>

                {/* Footer Buttons */}
                <div >
                    <div style={{ padding: "1rem 1rem 1rem 3px" }} >
                        {settingMenu && settingMenu.map((setting, i) => (
                            <Tooltip
                                key={i}
                                content={<p className="font-geist w-[120px]" style={{ padding: "10px 15px" }}>{setting.text}</p>}
                                placement="right"
                                trigger={isExpanded ? "none" : "hover"}
                                style="light"
                                animation="duration-300"
                                arrow={false}>
                                <SidebarItem
                                    icon={setting.icon}
                                    text={setting.text}
                                    expanded={isExpanded}
                                    // FIX 3: Actually use the state for Settings item
                                    active={onSettings}
                                    onClick={handleSettingsClick}
                                />
                            </Tooltip>
                        ))}
                    </div>
                    <div style={{ padding: "0px 1rem 1rem 1rem" }}>
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
            </div>

            {/* 2. Main Content Area */}
            <div
                style={{
                    marginLeft: sidebarWidth,
                    transition: `margin-left ${transitionDuration} ease`,
                    width: `calc(100% - ${sidebarWidth})`,
                    backgroundColor: "#f9fafb",
                    minHeight: "100vh",
                }}
            >
                <Outlet context={{ handleToggleSidebar }} />
            </div>
        </div >
    );
}

export { Sidebar };