import { logout } from "../../../functions/logoutAuth";
import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Ticket, CalendarDays, ShoppingBag, BookOpen, LogOut } from "lucide-react";
import logo from "/lv-logo.svg";
import { SidebarItem } from "../../../components/custom/SidebarItem";

function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, text: "Dashboard" },
        { icon: <Ticket size={20} />, text: "Student Eligibility Management" },
        { icon: <CalendarDays size={20} />, text: "Schedule of Student Eligibility" },
    ];

    useEffect(() => {
        const container = containerRef.current;
        if (container && container.children[activeIndex]) {
            const activeItem = container.children[activeIndex];
            const { offsetTop, offsetHeight } = activeItem;
            activeItem.style.backgroundColor = '#FFFFFF';
        }
    }, [activeIndex]);

    return (
        <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
            <div
                style={{
                    width: isExpanded ? '240px' : '72px',
                    height: '100vh',
                    background: '#263C70',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'width 0.3s ease',
                    overflow: 'hidden',
                }}
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
            >
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: isExpanded ? 'flex-start' : 'center', padding: '1rem' }}>
                        <img src={logo} alt="Logo" style={{ width: isExpanded ? '3.5rem' : '2.5rem', transition: 'all 0.3s ease' }} />
                        {isExpanded && (
                            <div style={{ marginLeft: '0.5rem' }}>
                                <p style={{ fontWeight: 'bold', fontSize: '1rem' }}>Eat's on Tap</p>
                                <p style={{ fontSize: '0.875rem' }}>La Verdad Christian College</p>
                            </div>
                        )}
                    </div>

                    <nav ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
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

                <div style={{ padding: '1rem' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isExpanded ? 'flex-start' : 'center',
                            gap: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            backgroundColor: '#142345',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                        }}
                    >
                        <LogOut size={18} />
                        {isExpanded && <span>Logout</span>}
                    </button>
                </div>
            </div>

            <div style={{ flexGrow: 1, backgroundColor: '#F4FDFF', overflowY: 'auto' }}>
                <Outlet />
            </div>
        </div>
    );
}

export default Sidebar;
