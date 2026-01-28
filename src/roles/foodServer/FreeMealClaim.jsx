import { logout } from "../../functions/logoutAuth";
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import { FaCheckCircle } from "react-icons/fa";

// 🟢 Import your function (Adjust path if necessary)
import { claimMeal } from "../../functions/foodServer/claimMeal";
import { isSettingActive } from "../../functions/isSettingActive"

export default function FreeMealClaim() {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [pageDislay, setPageDisplay] = useState("Tap") //another one is "Result", default: "Tap"
    const [mealClaimData, setMealClaimData] = useState({})
    // 🟢 1. State for the input
    const [studentId, setStudentId] = useState("");

    // 🟢 NEW STATE: Track System Status
    const [isSystemActive, setIsSystemActive] = useState(true);
    const [systemMessage, setSystemMessage] = useState("");

    // 🟢 2. Ref to keep input focused
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // 🟢 3. Handle the Scan (Enter Key)
    const handleScan = async (e) => {
        // Safety check: Prevent scan if system is inactive
        if (!isSystemActive) return;

        if (e.key === 'Enter') {
            e.preventDefault();

            if (!studentId.trim()) return;

            try {
                // 🟢 1. Capture the returned data in a variable
                const result = await claimMeal(studentId);

                // 🟢 2. Store that result in your state
                setMealClaimData(result);
                setStudentId(""); // Clear input for next student
                setPageDisplay("")
                setTimeout(() => {
                    setPageDisplay("Tap")
                }, 3000)
            } catch (error) {
                console.error(error);
                alert(error.message);
                setStudentId("");
            }
        }
    };

    useEffect(() => {
        // 🟢 CHECK SETTING STATUS ON MOUNT
        const checkSystemStatus = async () => {
            try {
                const status = await isSettingActive("STUDENT-CLAIM");
                // Expected format: { response: boolean, message: string }
                if (status) {
                    setIsSystemActive(status);

                    setSystemMessage(status.message);
                }
            } catch (error) {
                console.error("Failed to check system status:", error);
            }
        };
        checkSystemStatus();

        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        // 🟢 4. Ensure focus on load (Only if active)
        if (inputRef.current && isSystemActive) {
            inputRef.current.focus();
        }

        return () => clearInterval(timer);
    }, [isSystemActive]); // Added dependency to refire focus if status changes

    const dateString = currentDateTime.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const dateOnlyString = currentDateTime.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    const timeString = currentDateTime.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    return (
        pageDislay === "Tap" ? (
            <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>

                {/* 🟢 BACKGROUND IMAGE TAG */}
                <img
                    src="/studentClaim/Food-Server-Background.svg"
                    alt="Background"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        zIndex: 0,
                        pointerEvents: "none"
                    }}
                />

                {/* 🟢 YOUR CONTENT */}
                <div style={{
                    position: "relative",
                    zIndex: 10,
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <div style={{ display: "flex" }}>
                        <div style={{ height: "100vh", width: "55vw" }}>
                            <div style={{ width: "100%", height: "45%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 4 }}>
                                <img src="/lv-logo.svg" alt="lv-logo" style={{ height: "110px", width: "110px" }} />
                                <p style={{ fontWeight: 350 }} className="font-tolkien text-lg h-auto flex items-start text-white">LA VERDAD CHRISTIAN COLLEGE</p>
                                <p className="font-tiroTamil text-white text-[1.5vh]">
                                    MacArthur Highway, Sampaloc, Apalit, Pampanga 2016
                                </p>
                            </div>
                            <div style={{ width: "100%", height: "55%", display: "flex", justifyContent: "center", alignItems: "start" }}>

                                {/* 🟢 PARENT CONTAINER (Relative) */}
                                <div style={{
                                    position: "relative",
                                    width: "90%",
                                    height: "90%"
                                }}>

                                    {/* 🟢 1. IMAGE LAYER (Absolute - Back) */}
                                    <img
                                        src="/studentClaim/claim-card.svg"
                                        alt="claim card"
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                            zIndex: 0
                                        }}
                                    />

                                    {/* 🟢 2. CONTENT LAYER (Absolute - Front) */}
                                    <div style={{
                                        position: "absolute",
                                        top: 0, left: 0, width: "100%", height: "100%", zIndex: 10,
                                        display: "flex", justifyContent: "center", alignItems: "center"
                                    }}>
                                        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", gap: 8 }}>

                                            <p className="font-geist text-lg text-white mb-1">Scan now or Input Student ID</p>

                                            <hr style={{ width: "70%", borderColor: "rgba(255,255,255,0.3)", margin: "0px 0px 25px 0px" }} />

                                            {/* 🟢 3. INSERTED DATE & TIME */}
                                            <div className="flex flex-col items-center text-white">
                                                <p className="text-md font-geist" style={{ letterSpacing: '1px' }}>
                                                    {dateString.toUpperCase()}
                                                </p>
                                                <p className="text-6xl font-geist  mt-1" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)", marginBottom: "15px" }}>
                                                    {timeString}
                                                </p>
                                            </div>

                                            {/* 🟢 INTEGRATED INPUT - DISABLED IF INACTIVE */}
                                            <Input
                                                ref={inputRef}
                                                disabled={!isSystemActive} // Disable input
                                                value={studentId}
                                                onChange={(e) => setStudentId(e.target.value)}
                                                onKeyDown={handleScan}
                                                autoFocus={isSystemActive} // Only autofocus if active
                                                style={{
                                                    background: isSystemActive ? '#FFFFFF' : '#e5e7eb', // Grey out if disabled
                                                    width: '23vw',
                                                    height: '6vh',
                                                    paddingLeft: '5px',
                                                    font: 'geist',
                                                    margin: "0px 0px 10px 0px", // Reduced margin slightly for error msg space
                                                    cursor: isSystemActive ? 'text' : 'not-allowed'
                                                }}
                                                type="text"
                                                // Show system message as placeholder if inactive
                                                placeholder={isSystemActive ? "Student ID" : systemMessage || "Claim Disabled at this time"}
                                            />

                                            {/* Optional: Show message text below input if inactive */}
                                            {!isSystemActive && (
                                                <p className="text-red-300 font-geist text-sm">{systemMessage}</p>
                                            )}

                                        </div>
                                    </div>

                                </div>
                            </div>
                            This is free meal claim for food server
                            <Button onClick={handleLogout}>
                                Log out
                            </Button>
                        </div>
                        <div style={{ height: "100vh", width: "45vw" }}>
                            <div style={{ height: "15vh", width: "100%", display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                                <img src="/studentClaim/Free-Lunch-Label.svg" alt="free lunch label" />
                            </div>
                            <div style={{ height: "85vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "start" }}>
                                <img src="/studentClaim/Food-Background.svg" alt="free lunch label" />
                            </div>
                        </div>

                    </div>

                </div>

            </div>

        ) : (
            <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
                {/* 🟢 BACKGROUND IMAGE TAG */}
                <img
                    src="/studentClaim/Eligible.svg"
                    alt="Background"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        zIndex: 0,
                        pointerEvents: "none"
                    }}
                />

                <div style={{
                    position: "relative",
                    zIndex: 10,
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "center"
                }}>

                    {/* <img src="/studentClaim/Eligible_Sinage.svg" alt="Eligible Sinage" style={{ width: "170px", height: "170px" }} />    */}
                    {mealClaimData.temporaryClaimStatus[0] == "ELIGIBLE" ? (
                        <img src="/studentClaim/Eligible_Sinage.svg" alt="Eligible Sinage" style={{ width: "170px", height: "170px" }} />
                    ) : ""}
                    {mealClaimData.temporaryClaimStatus[0] == "CLAIMED" ? (
                        <img
                            src="/studentClaim/ALREADY_CLAIMED.svg"
                            alt="Background"
                            style={{ width: "190px", height: "190px" }}
                        />
                    ) : ""}


                    <div style={{ width: "100%", height: "55%", display: "flex", justifyContent: "center", alignItems: "start" }}>

                        {/* 🟢 PARENT CONTAINER (Relative) */}
                        <div style={{
                            position: "relative",
                            width: "90%",
                            height: "90%"
                        }}>

                            {/* 🟢 1. IMAGE LAYER (Absolute - Back) */}
                            {mealClaimData.section === 'BSIS' ? (
                                <img
                                    src="/studentClaim/Card_Template_BSIS.svg"
                                    alt="claim card"
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                        zIndex: 0
                                    }}
                                />
                            ) : mealClaimData.section === 'ACT' ? (
                                <img
                                    src="/studentClaim/Card_Template_ACT.svg"
                                    alt="claim card"
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                        zIndex: 0
                                    }}
                                />
                            ) : <img
                                src="/studentClaim/Card_Template_Basic_Ed.svg"
                                alt="claim card"
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    zIndex: 0
                                }}
                            />}


                            {/* 🟢 2. CONTENT LAYER (Absolute - Front) */}
                            <div style={{
                                position: "absolute",
                                top: 0, left: 0, width: "100%", height: "100%", zIndex: 10,
                                display: "flex", justifyContent: "center", alignItems: "center"
                            }}>
                                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", padding: "5px" }}>

                                    <div className="w-[45%] h-[20%] flex flex-row">
                                        <img src="lv-logo.svg" alt="lv-logo" style={{ height: "60px", width: "60px", margin: "5px 10px 5px 20px" }} />
                                        <div className="h-[100%] flex items-center">
                                            {/*<p style={{ fontWeight: 400 }} className="font-geist text-md text-white">{mealClaimData.last_name}, {mealClaimData.first_name}</p>*/}
                                            <p style={{ fontWeight: 400 }} className="font-geist text-md text-white">Eat's on Tap Validity Card</p>
                                        </div>
                                    </div>
                                    <div className="w-[45%] h-[80%]" style={{ paddingTop: "20px" }}>
                                        <div className="h-[100%] w-[100] flex items-center justify-between" style={{ marginLeft: "20px" }}>
                                            <div className="w-[100%] h-[100%] flex flex-row">
                                                <div className="w-auto flex flex-col items-center gap-2">
                                                    <img src="/studentClaim/Default_Picture.jpg" alt="default picture" style={{ width: "160px", height: "160px" }} />
                                                    <p style={{ fontWeight: 400 }} className="font-geist text-[10px] text-white w-[160px]">
                                                        {dateOnlyString.toUpperCase()} | {timeString}
                                                    </p>
                                                </div>
                                                <div style={{ marginLeft: "20px", display: "flex", flexDirection: "column", gap: 20 }} className="h-[100%] flex flex-column justify-start">
                                                    <div>
                                                        <p style={{ fontWeight: 400 }} className="font-geist text-xl text-white">{mealClaimData.last_name}, {mealClaimData.first_name}</p>
                                                        <p style={{ fontWeight: 350 }} className="font-geist text-xs text-[#999797]">Student Name</p>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: 400 }} className="font-geist text-xl text-white">{mealClaimData.section} - {mealClaimData.year}</p>
                                                        <p style={{ fontWeight: 350 }} className="font-geist text-xs text-[#999797]">Section / Year</p>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: 400 }} className="font-geist text-xl text-white">{mealClaimData.studentID}</p>
                                                        <p style={{ fontWeight: 350 }} className="font-geist text-xs text-[#999797]">StudentID</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                {mealClaimData.section === 'ACT' ? (
                                                    <img src="/studentClaim/logo-ACT.svg" al t='bsis-logo' style={{ width: "170px", height: "170px", paddingBottom: "10px" }} />

                                                ) : mealClaimData.section === 'BSIS' ? (
                                                    <img src="/studentClaim/logo-BSIS.svg" al t='bsis-logo' style={{ width: "170px", height: "170px", paddingBottom: "10px" }} />
                                                ) : <img src="lv-logo.svg" al t='bsis-logo' style={{ width: "170px", height: "170px", paddingBottom: "10px", paddingRight: "10px" }} />}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-[45%] h-[20%]">
                                        <p style={{ fontWeight: 350, marginLeft: "20px", paddingBottom: "10px" }} className="font-geist text-xs text-[#999797] w-[100%] h-[100%] flex items-end">
                                            Note: Non-transferable and valid for daily use only
                                        </p>
                                    </div>


                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    );
}