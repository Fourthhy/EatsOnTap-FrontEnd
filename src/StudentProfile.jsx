// import React from 'react';

// --- HELPER COMPONENT: The Monthly Claim Graph ---
const ContributionGraph = () => {
    const getDaysInCurrentMonth = () => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    };

    const daysCount = getDaysInCurrentMonth();
    const days = Array.from({ length: daysCount });

    const getStatusConfig = (dayIndex) => {
        // Mock Data for visual testing
        const statuses = ['ELIGIBLE', 'CLAIMED', 'UNCLAIMED', 'WAIVED', 'NO-SCHEDULE'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        switch (randomStatus) {
            case 'ELIGIBLE': return { color: '#f97316', status: 'Eligible' }; // Orange
            case 'CLAIMED': return { color: '#22c55e', status: 'Claimed' };   // Green
            case 'UNCLAIMED': return { color: '#ef4444', status: 'Unclaimed' }; // Red
            case 'WAIVED': return { color: '#9ca3af', status: 'Waived' };     // Gray
            case 'NO-SCHEDULE': return { color: '#F7F9F9', status: 'No Schedule' }; // Off-white
            default: return { color: '#F7F9F9', status: 'Unknown' };
        }
    };

    return (
        <div style={{ width: '100%', marginTop: 'clamp(16px, 4vw, 24px)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' }}>
            {/* Fluid Header Text */}
            <p className="font-geist font-bold text-[#676767]" style={{ fontSize: 'clamp(12px, 3vw, 14px)', textAlign: 'center', marginBottom: '12px' }}>
                Claim history for this month
            </p>

            <div style={{
                width: '100%',
                overflowX: 'auto',
                display: 'flex',
                justifyContent: 'center',
                paddingBottom: '8px'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateRows: 'repeat(6, clamp(12px, 3.5vw, 16px))', // Fluid grid tiles
                    gridAutoFlow: 'column',
                    gridAutoColumns: 'clamp(12px, 3.5vw, 16px)',
                    gap: 'clamp(2px, 1vw, 4px)', // Fluid gap
                }}>
                    {days.map((_, i) => {
                        const config = getStatusConfig(i);
                        return (
                            <div
                                key={i}
                                title={`Day ${i + 1}: ${config.status}`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '3px',
                                    backgroundColor: config.color,
                                    border: '1px solid transparent'
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* LEGEND */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 12px', justifyContent: 'center', fontSize: '10px', color: '#676767', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', backgroundColor: '#f97316', borderRadius: '2px' }}></div> Eligible</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '2px' }}></div> Claimed</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '2px' }}></div> Unclaimed</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '2px' }}></div> Waived</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', backgroundColor: '#F7F9F9', borderRadius: '2px' }}></div> No Sched</div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
export default function StudentProfile() {
    const disclaimerMessage = "your profile will be displayed when claiming meals :>";

    return (
        <>
            {/* PARENT DIV - Uses slightly darker grey (#E5E7EB) so the white card bounds are clearly visible */}
            <div style={{
                backgroundColor: "#E5E7EB",
                minHeight: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "16px",
                boxSizing: "border-box",
                overflowY: "hidden"
            }}>
                {/* CARD DIV - Using 85vw guarantees it will NEVER touch the edges on mobile */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    width: 'clamp(280px, 85vw, 400px)', // The core fluid constraint
                    zIndex: 10,
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                    padding: "10px"
                }}>

                    {/*HEADER ELEMENT*/}
                    <div style={{ margin: "clamp(12px, 3vw, 20px) 0px" }}>
                        {/* Fluid Font Size for Title */}
                        <p className="font-geist font-bold text-[#153FA3] leading-tight" style={{ fontSize: 'clamp(18px, 5vw, 24px)' }}>
                            Student Claim History
                        </p>
                        <p className="font-geist text-[#676767] mt-1 text-xs">
                            <i>This is where your claim keeps track</i>
                        </p>
                    </div>

                    {/* IMAGE ELEMENT - Fluid width and height using clamp */}
                    <img
                        src="/should_i_call_you_mister.png"
                        alt="profile image"
                        style={{
                            width: "clamp(120px, 35vw, 180px)",
                            height: "clamp(120px, 35vw, 180px)",
                            borderRadius: "50%",
                            border: "#F7F9F9 4px solid",
                            boxShadow: '0 10px 20px -5px rgba(0,0,0,0.1)',
                            objectFit: 'cover',
                            margin: 'clamp(8px, 2vw, 16px) 0'
                        }}
                    />

                    {/*TEXT ELEMENTS*/}
                    <div style={{ margin: "clamp(5px, 3vw, 20px) 0px", width: '100%' }}>
                        {/* Fluid Font Size for Name */}
                        <p className="font-geist font-medium leading-tight" style={{ fontSize: 'clamp(16px, 4.5vw, 20px)' }}>
                            LastName, FirstName MiddleName
                        </p>
                        <p className="font-geist text-[#676767] mt-1" style={{ fontSize: 'clamp(10px, 2.5vw, 12px)' }}>
                            <i>{disclaimerMessage}</i>
                        </p>
                    </div>

                    {/* THE MONTHLY HEATMAP COMPONENT */}
                    <ContributionGraph />
                    {/* <p className="font-geist text-[#676767] mt-1 text-xs">
                        <i>Constructing heat map, to be released God willing!</i>
                    </p> */}
                </div>
            </div>
        </>
    );
}