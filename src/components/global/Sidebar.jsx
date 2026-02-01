import { logout } from "../../functions/logoutAuth";
import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Loader2 } from "lucide-react"; // 🟢 Added Loader2
import { useBreakpoint } from "use-breakpoint";
import logo from "/lv-logo.svg";
import { SidebarItem } from "./SidebarItem";
import { motion, AnimatePresence } from "framer-motion";

function Sidebar({ menuItems, menutItemsLabel, quickActions, quickActionsLabel, settingMenu }) {
    const navigate = useNavigate();
    const location = useLocation();

    // --- STATE ---
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false); // 🟢 New Loading State
    const containerRef = useRef(null);

    // --- HELPER: Determine if a path is active ---
    const isPathActive = (path) => {
        if (!path) return false;
        if (location.pathname === path) return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    // --- EFFECT: Update Document Title ---
    useEffect(() => {
        const allItems = [...(quickActions || []), ...menuItems, ...(settingMenu || [])];
        const currentItem = allItems.find(item => isPathActive(item.path));
        const pageTitle = currentItem ? currentItem.text : "Dashboard";
        document.title = `${pageTitle} - Eat's on Tap`;
    }, [location.pathname, menuItems, quickActions, settingMenu]);

    // 🟢 UPDATED: Async Logout Handler with Loader
    const handleLogout = async () => {
        if (isLoggingOut) return; // Prevent double clicks

        setIsLoggingOut(true); // Start Loader

        try {
            await logout(); // Wait for the API call to finish
        } catch (error) {
            console.error("Logout process encountered an error:", error);
        } finally {
            // Navigate regardless of success or failure to ensure user isn't stuck
            navigate('/');
            // No need to set false, component will unmount
        }
    };

    const handleItemClick = (path) => {
        navigate(path);
    };

    const BREAKPOINTS = {
        'mobile-md': 375, 'mobile-lg': 425, 'tablet': 768,
        'laptop-md': 1024, 'laptop-lg': 1440,
    };

    const { breakpoint } = useBreakpoint(BREAKPOINTS, 'mobile-md');

    // This controls the SIDEBAR width (Dynamic)
    const sidebarWidth = isExpanded ? "288px" : "80px";

    // This controls the CONTENT margin (Static)
    const contentMargin = "80px";

    // Shared transition for sync
    const springTransition = {
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 0.8,
    };

    return (
        <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#F4FDFF" }}>
            {/* 1. Sidebar (Floating Layer) */}
            <motion.div
                initial={false}
                animate={{ width: sidebarWidth }}
                style={{
                    height: "100vh",
                    background: "linear-gradient(to bottom, #153FA3, #142345)",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 9000,
                    overflow: "hidden",
                    boxShadow: isExpanded ? "4px 0 24px rgba(0,0,0,0.25)" : "none"
                }}
                transition={springTransition}
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
            >
                <div>
                    {/* --- LOGO AREA (ANIMATED) --- */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "1rem",
                        marginBottom: "1.5rem",
                        minHeight: "3.5rem",
                        paddingLeft: "20px",
                        overflow: "hidden"
                    }}>
                        {/* Stationary Logo Image */}
                        <motion.img
                            src={logo}
                            alt="Logo"
                            initial={false}
                            animate={{
                                width: isExpanded ? "3.5rem" : "2.5rem",
                                height: isExpanded ? "3.5rem" : "2.5rem"
                            }}
                            style={{
                                flexShrink: 0,
                                objectFit: "contain",
                                zIndex: 10,
                                position: "relative"
                            }}
                            transition={springTransition}
                        />

                        {/* Sliding Text */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    style={{
                                        marginLeft: '10px',
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        zIndex: 5,
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    <p style={{ fontWeight: "bold" }} className="font-geist text-[13px] h-auto flex items-end">Eat's on Tap</p>
                                    <p style={{ fontWeight: 'regular' }} className="font-tolkien text-[11px] h-auto flex items-start">LA VERDAD CHRISTIAN COLLEGE</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
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
                        {quickActions && quickActions.map((item, i) => (
                            <SidebarItem
                                key={i}
                                icon={item.icon}
                                text={item.text}
                                expanded={isExpanded}
                                active={isPathActive(item.path)}
                                onClick={() => {
                                    if (item.onClickAction) {
                                        item.onClickAction();
                                    } else if (item.path) {
                                        handleItemClick(item.path);
                                    }
                                }}
                            />
                        ))}

                        <div style={{ margin: "10px 0", width: "100%", display: "flex", justifyContent: "center" }}>
                            <hr style={{ width: "90%", opacity: 0.3 }} />
                        </div>

                        {menuItems.map((item, i) => (
                            <SidebarItem
                                key={i}
                                index={i}
                                icon={item.icon}
                                text={item.text}
                                expanded={isExpanded}
                                active={isPathActive(item.path)}
                                onClick={() => handleItemClick(item.path)}
                            />
                        ))}
                    </nav>
                </div>

                {/* Footer Buttons / Settings */}
                <div>
                    <div style={{ padding: "1rem 1rem 1rem 3px" }} >
                        {settingMenu && settingMenu.map((setting, i) => (
                            <SidebarItem
                                key={i}
                                icon={setting.icon}
                                text={setting.text}
                                expanded={isExpanded}
                                active={isPathActive(setting.path)}
                                onClick={() => handleItemClick(setting.path)}
                            />
                        ))}
                    </div>

                    {/* --- LOGOUT BUTTON --- */}
                    <div style={{ padding: "0px 1rem 1rem 1rem" }}>
                        <motion.button
                            onClick={handleLogout}
                            disabled={isLoggingOut} // Disable while loading
                            initial={false}
                            animate={{
                                width: "100%",
                                justifyContent: "flex-start",
                                backgroundColor: isLoggingOut ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.3)",
                                paddingLeft: "12px",
                                cursor: isLoggingOut ? "wait" : "pointer"
                            }}
                            whileHover={!isLoggingOut ? { backgroundColor: "#52728F" } : {}}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                height: "50px",
                                borderRadius: "0.5rem",
                                border: "none",
                                color: "white",
                                position: "relative",
                                overflow: "hidden"
                            }}
                            transition={springTransition}
                        >
                            <div style={{
                                position: 'relative',
                                zIndex: 10,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '24px'
                            }}>
                                {/* 🟢 Swap Icon for Loader when loading */}
                                {isLoggingOut ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Loader2 size={20} />
                                    </motion.div>
                                ) : (
                                    <LogOut size={20} />
                                )}
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        style={{
                                            fontSize: "0.875rem",
                                            marginLeft: "12px",
                                            whiteSpace: "nowrap",
                                            zIndex: 5
                                        }}
                                    >
                                        {isLoggingOut ? "Logging out..." : "Logout"}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* 2. Main Content Area */}
            <div
                style={{
                    marginLeft: contentMargin, // Fixed at 80px
                    width: `calc(100% - ${contentMargin})`, // Fixed width
                    backgroundColor: "#f9fafb",
                    minHeight: "100vh",
                    transition: "all 0.3s ease"
                }}
            >
                <Outlet context={{ isSidebarOpen: isExpanded, handleToggleSidebar: () => setIsExpanded(!isExpanded) }} />
            </div>
        </div >
    );
}

export { Sidebar };