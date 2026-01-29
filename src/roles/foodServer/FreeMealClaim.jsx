import { logout } from "../../functions/logoutAuth";
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import { FaCheckCircle } from "react-icons/fa";

import { fetchAllStudents } from "../../functions/foodServer/fetchAllStudents";
import { isSettingActive } from "../../functions/isSettingActive";

export default function FreeMealClaim() {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [pageDislay, setPageDisplay] = useState("Tap"); 
    const [mealClaimData, setMealClaimData] = useState({});
    
    const [allStudents, setAllStudents] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // This state acts as the "Search Term" (can be ID or RFID)
    const [inputVal, setInputVal] = useState("");
    
    const [isSystemActive, setIsSystemActive] = useState(true);
    const [systemMessage, setSystemMessage] = useState("");

    const inputRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // 🟢 3. UPDATED SCAN LOGIC
    const handleScan = async (e) => {
        if (!isSystemActive) return;

        if (e.key === 'Enter') {
            e.preventDefault();

            const trimmedInput = inputVal.trim();
            if (!trimmedInput) return;

            // 🟢 A. DETERMINE SEARCH TYPE
            // If input contains ONLY numbers, treat as RFID. Otherwise, Student ID.
            const isRFID = /^\d+$/.test(trimmedInput);

            // 🟢 B. FIND STUDENT
            const foundIndex = allStudents.findIndex(s => {
                if (isRFID) {
                    // Match RFID Tag
                    return s.rfidTag === trimmedInput;
                } else {
                    // Match Student ID (Case insensitive safe check)
                    return s.studentID?.toLowerCase() === trimmedInput.toLowerCase();
                }
            });

            if (foundIndex !== -1) {
                const updatedStudentList = [...allStudents];
                const targetStudent = { ...updatedStudentList[foundIndex] };

                // Get status to decide which screen to show
                const currentStatus = targetStudent.temporaryClaimStatus && targetStudent.temporaryClaimStatus[0];
                
                // Set data for display
                setMealClaimData(targetStudent); 

                // 🟢 C. UPDATE LOCAL STATUS
                // Only update to CLAIMED if they are currently ELIGIBLE
                if (currentStatus === "ELIGIBLE") {
                    targetStudent.temporaryClaimStatus = ["CLAIMED"];
                    updatedStudentList[foundIndex] = targetStudent;
                    setAllStudents(updatedStudentList); 
                }

                // Reset UI
                setInputVal(""); 
                setPageDisplay(""); 
                
                setTimeout(() => {
                    setPageDisplay("Tap");
                }, 5000);

            } else {
                alert(isRFID ? "RFID Tag not recognized." : "Student ID not found.");
                setInputVal("");
            }
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const students = await fetchAllStudents();
                if (Array.isArray(students)) {
                    setAllStudents(students);
                    setIsDataLoaded(true);
                    console.log(`Loaded ${students.length} students.`);
                }
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        const checkSystemStatus = async () => {
            try {
                const status = await isSettingActive("STUDENT-CLAIM");
                if (status) {
                    setIsSystemActive(status);
                    setSystemMessage(status.message);
                }
            } catch (error) {
                console.error("Failed to check status:", error);
            }
        };

        loadData();
        checkSystemStatus();

        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        if (inputRef.current && isSystemActive) {
            inputRef.current.focus();
        }

        return () => clearInterval(timer);
    }, [isSystemActive]);

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

                <img
                    src="/studentClaim/Food-Server-Background.svg"
                    alt="Background"
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, pointerEvents: "none" }}
                />

                <div style={{ position: "relative", zIndex: 10, height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
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

                                <div style={{ position: "relative", width: "90%", height: "90%" }}>

                                    <img
                                        src="/studentClaim/claim-card.svg"
                                        alt="claim card"
                                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 0 }}
                                    />

                                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", gap: 8 }}>

                                            <p className="font-geist text-lg text-white mb-1">Scan now or Input Student ID</p>

                                            <hr style={{ width: "70%", borderColor: "rgba(255,255,255,0.3)", margin: "0px 0px 25px 0px" }} />

                                            <div className="flex flex-col items-center text-white">
                                                <p className="text-md font-geist" style={{ letterSpacing: '1px' }}>
                                                    {dateString.toUpperCase()}
                                                </p>
                                                <p className="text-6xl font-geist  mt-1" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)", marginBottom: "15px" }}>
                                                    {timeString}
                                                </p>
                                            </div>

                                            {/* 🟢 INPUT FIELD */}
                                            <Input
                                                ref={inputRef}
                                                disabled={!isSystemActive || !isDataLoaded}
                                                value={inputVal}
                                                onChange={(e) => setInputVal(e.target.value)}
                                                onKeyDown={handleScan}
                                                autoFocus={isSystemActive}
                                                style={{
                                                    background: (isSystemActive && isDataLoaded) ? '#FFFFFF' : '#e5e7eb',
                                                    width: '23vw',
                                                    height: '6vh',
                                                    paddingLeft: '5px',
                                                    font: 'geist',
                                                    margin: "0px 0px 10px 0px",
                                                    cursor: (isSystemActive && isDataLoaded) ? 'text' : 'not-allowed'
                                                }}
                                                type="text"
                                                placeholder={
                                                    !isSystemActive ? (systemMessage || "Claim Disabled") :
                                                    !isDataLoaded ? "Loading Data..." : 
                                                    "Student ID or RFID"
                                                }
                                            />

                                            {!isSystemActive && (
                                                <p className="text-red-300 font-geist text-sm">{systemMessage}</p>
                                            )}

                                        </div>
                                    </div>

                                </div>
                            </div>
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
                <img
                    src="/studentClaim/Eligible.svg"
                    alt="Background"
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, pointerEvents: "none" }}
                />

                <div style={{ position: "relative", zIndex: 10, height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "center" }}>

                    {mealClaimData.temporaryClaimStatus[0] === "ELIGIBLE" ? (
                        <img src="/studentClaim/Eligible_Sinage.svg" alt="Eligible Sinage" style={{ width: "170px", height: "170px" }} />
                    ) : null}
                    
                    {mealClaimData.temporaryClaimStatus[0] === "CLAIMED" ? (
                        <img src="/studentClaim/ALREADY_CLAIMED.svg" alt="Background" style={{ width: "190px", height: "190px" }} />
                    ) : null}


                    <div style={{ width: "100%", height: "55%", display: "flex", justifyContent: "center", alignItems: "start" }}>

                        <div style={{ position: "relative", width: "90%", height: "90%" }}>

                            {mealClaimData.section === 'BSIS' ? (
                                <img src="/studentClaim/Card_Template_BSIS.svg" alt="claim card" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 0 }} />
                            ) : mealClaimData.section === 'ACT' ? (
                                <img src="/studentClaim/Card_Template_ACT.svg" alt="claim card" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 0 }} />
                            ) : <img src="/studentClaim/Card_Template_Basic_Ed.svg" alt="claim card" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 0 }} />}


                            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", padding: "5px" }}>

                                    <div className="w-[45%] h-[20%] flex flex-row">
                                        <img src="lv-logo.svg" alt="lv-logo" style={{ height: "60px", width: "60px", margin: "5px 10px 5px 20px" }} />
                                        <div className="h-[100%] flex items-center">
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
                                                        <p style={{ fontWeight: 400 }} className="font-geist text-xl text-white">{mealClaimData.section || mealClaimData.program} - {mealClaimData.year}</p>
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
                                                    <img src="/studentClaim/logo-ACT.svg" alt='bsis-logo' style={{ width: "170px", height: "170px", paddingBottom: "10px" }} />

                                                ) : mealClaimData.section === 'BSIS' ? (
                                                    <img src="/studentClaim/logo-BSIS.svg" alt='bsis-logo' style={{ width: "170px", height: "170px", paddingBottom: "10px" }} />
                                                ) : <img src="lv-logo.svg" alt='bsis-logo' style={{ width: "170px", height: "170px", paddingBottom: "10px", paddingRight: "10px" }} />}
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