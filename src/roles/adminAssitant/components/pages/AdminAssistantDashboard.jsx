import { useOutletContext } from 'react-router-dom';
import { Menu } from "lucide-react"
import { RiNotification2Fill } from "react-icons/ri"
import { StatsCardGroup } from '../../../admin/components/dashboard/StatsCardGroup';
//src\roles\admin\components\dashboard\StatsCardGroup.jsx
import { EventsPanel } from '../../../admin/components/dashboard/EventsPanel';
import { RecentEvents } from '../RecentEvents';
import { ProgramsList } from '../ProgramsList';
import { QuickActions } from '../QuickActions';
import { ScheduleTabs } from '../ScheduleTabs';


import { useState } from 'react';

export default function AdminAssistantDashboard() {
    const context = useOutletContext() || {};
    const handleToggleSidebar = context.handleToggleSidebar || (() => { });
    const USER_AVATAR = "https://randomuser.me/api/portraits/lego/3.jpg";

    const date = new Date();
    const dayIndex = date.getDay();
    const [selectedTab, setSelectedTab] = useState(dayIndex);

    const higherEducationMealClaimStatus = [
        { title: "Meal Claims", value: 1200, subtitle: "80% of total alotted" },
        { title: "Meal Unclaims", value: 300, subtitle: "20% of total alotted" },
        { title: "Total Alotted Meals", value: 1500, subtitle: "Today" },
    ]

    const upcomingEvents = [
        { link: "#", title: "President' Day", date: "Nov 25, 2025" },
        { link: "#", title: "College Intramurals", date: "Dec 15, 2025" }
    ]

    const recentEvents = [
        { link: "#", title: "President' Day", date: "Nov 25, 2025" },
        { link: "#", title: "College Intramurals", date: "Dec 15, 2025" }
    ]

    return (
        <>

            <div
                style={{
                    backgroundColor: "#F7F9F9",
                    marginBottom: "30px"
                }}
                className="w-full h-auto flex flex-col justify-start">

                {/* HEADER */}
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
                            {/* <GreetingCard title={"Good Morning"} subtitle={"Manage meal schedules and student eligibility for higher education students"}/> */}

                            <ScheduleTabs
                                selectedTab={selectedTab}
                                onTabChange={setSelectedTab}
                            >
                                <div style={{ marginTop: 10 }} className="w-full flex flex-col items-center">
                                    <div className="w-[98%]">
                                        <StatsCardGroup
                                            cardGroupTitle={"Claim Status"}
                                            isDualPager={false}
                                            urgentNotification={0}
                                            primaryData={higherEducationMealClaimStatus}
                                            displayDate={true}
                                            footnote={"That report contains from the collection of schedled programs and years listed below"}
                                        />
                                    </div>
                                </div>
                                <ProgramsList />
                            </ScheduleTabs>
                        </div>
                        <div className="w-full h-auto flex flex-col gap-4">
                            <div>
                                <QuickActions />
                            </div>
                            <div>
                                <EventsPanel events={upcomingEvents} />
                            </div>
                            <div>
                                <RecentEvents events={recentEvents} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}