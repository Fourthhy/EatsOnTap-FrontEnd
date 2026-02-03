import { useEffect } from "react";
import { useBreakpoint } from "use-breakpoint";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./components/ui/button";
import { Label } from "@/components/ui/label";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { loginApi } from "./functions/loginAuth";
import { resetUserPasswordToDefault } from "./functions/admin/resetUserPasswordToDefault";

export default function LoginRegistration() {
    const { userEmail } = useParams();
    const [email, setEmail] = useState(userEmail || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const loginHeader = "Registration - Eat's on Tap";

    // 🟢 UPDATED: Set Loading State during Reset
    useEffect(() => {
        document.title = loginHeader;

        const initializeRegistration = async () => {
            if (userEmail) {
                setLoading(true); // 🟢 Lock UI immediately
                try {
                    await resetUserPasswordToDefault(userEmail);
                    console.log(`Password reset to default for ${userEmail}`);
                } catch (err) {
                    console.error("Failed to initialize registration:", err);
                    setError("Failed to initialize registration. Please try the link again.");
                } finally {
                    setLoading(false); // 🟢 Unlock UI when done
                }
            }
        };

        initializeRegistration();
    }, [userEmail]);

    const handleSubmit = async () => {
        setError('');
        setErrorPassword('');
        setLoading(true);

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // 1. Validation (UI Check)
        if (!trimmedEmail) {
            setError('Email is required.');
            setLoading(false);
            return;
        }

        if (!trimmedPassword) {
            setErrorPassword('Password is required.');
            setLoading(false);
            return;
        }

        // 🟢 REMOVED DOMAIN VALIDATION AS REQUESTED

        try {
            // 2. Extract Name from Email to use as temporary "Password"
            const extractedNameAsPassword = trimmedEmail.split('@')[0];

            // 3. Login
            const data = await loginApi(trimmedEmail, extractedNameAsPassword);

            if (data.section) {
                navigate(`/classAdviser/${data.section}/${data.userID}/submitMealList`);
            }

            switch (data.role) {
                case 'ADMIN':
                    navigate('/admin/dashboard');
                    break;
                case 'ADMIN-ASSISTANT':
                    navigate('/adminAssistant');
                    break;
                case 'CANTEEN-STAFF':
                    navigate('/canteenStaff');
                    break;
                case 'CHANCELLOR':
                    navigate('/chancellor');
                    break;
                case 'FOOD-SERVER':
                    navigate('/foodServer');
                    break;
                case 'SUPER-ADMIN':
                    navigate('/superAdmin');
                    break;
                default:
                    setError('Unknown user role.');
                    setLoading(false);
                    return;
            }

        } catch (error) {
            setError(error.message || 'Network Error');

            setTimeout(() => {
                setError('');
                setLoading(false);
                setEmail(userEmail || '');
                setPassword('');
            }, 3000);
        }
    };


    const BREAKPOINTS = {
        'mobile-md': 375,
        'mobile-lg': 425,
        'tablet': 768,
        'laptop-md': 1024,
        'laptop-lg': 1440,
    };

    const { breakpoint } = useBreakpoint(BREAKPOINTS, 'mobile-md');

    const buttonHeight =
        breakpoint === 'laptop-lg'
            ? '4vh'
            : breakpoint === 'laptop-md'
                ? '6vh'
                : '4vh';

    const inputBoxHeight =
        breakpoint === 'laptop-lg'
            ? '4vh'
            : breakpoint === 'laptop-md'
                ? '6vh'
                : '5vh';

    const screenType =
        breakpoint === 'laptop-md' || breakpoint === 'laptop-lg' ? "laptop" :
            breakpoint === 'mobile-md' || breakpoint === 'mobile-lg' || breakpoint === "tablet" ? "handheld" : "";

    return (
        <>
            {screenType === "laptop" ?
                <>
                    <div className="h-[100vh] w-[100vw]">
                        <div
                            className="h-[100vh] w-[100vw]"
                            style={{
                                margin: 0,
                                padding: 0,
                                background: 'linear-gradient(to bottom, #153FA3, #142345)',
                            }}
                        >
                            <div className="grid grid-cols-[40vw_60vw]">
                                {/*LOGIN MODAL*/}
                                <div className="w-[100%] h-[100%] flex flex-col items-center justify-center">

                                    <div className="flex flex-col items-center" style={{ marginBottom: '20px' }}>
                                        <img style={{ width: '5vw', marginBottom: '10px' }} src="/lv-logo.svg" alt="lv logo" />
                                        <p style={{ marginBottom: '3px' }} className="font-tolkien text-white text-[1.6vw]">
                                            LA VERDAD CHRISITIAN COLLEGE
                                        </p>
                                        <p className="font-tiroTamil text-white text-[1.5vh]">
                                            MacArthur Highway, Sampaloc, Apalit, Pampanga 2016
                                        </p>
                                    </div>

                                    <div
                                        className="w-100 h-100 [border-top-left-radius:32px] [border-bottom-right-radius:32px]"
                                        style={{
                                            backgroundColor: '#ffffff26',
                                            boxShadow: '0 0 25px rgba(0, 0, 0, 0.25)'
                                        }}
                                    >

                                        <div className="w-[100%] h-[100%] flex flex-col gap-4 items-center justify-center">

                                            <div>
                                                <div style={{ color: "#FFF", fontFamily: "geist", paddingBottom: "5px", }}>
                                                    <Label style={{ fontWeight: 400 }} >Email</Label>
                                                </div>
                                                <Input
                                                    style={{
                                                        background: '#FFFFFF',
                                                        width: '23vw',
                                                        height: inputBoxHeight,
                                                        paddingLeft: '5px',
                                                        font: 'geist',
                                                        border: `${error == "" ? "" : "red 1px solid"}`
                                                    }}
                                                    type="email"
                                                    placeholder="example@laverdad.edu.ph"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    disabled={loading}
                                                />
                                                {error === "" ? "" :
                                                    <>
                                                        <Label>
                                                            <p style={{
                                                                fontFamily: 'geist',
                                                                font: 'regular',
                                                                color: '#D13B3B',
                                                                paddingTop: '3px',
                                                                paddingLeft: '5px'
                                                            }}
                                                                className="text-xs"
                                                            >
                                                                {error}
                                                            </p>
                                                        </Label>
                                                    </>
                                                }
                                            </div>
                                            <div style={{ position: 'relative' }}>
                                                <div style={{ color: "#FFF", fontFamily: "geist", paddingBottom: "5px", }}>
                                                    <Label style={{ fontWeight: 400 }} >New Password</Label>
                                                </div>
                                                <Input
                                                    style={{
                                                        background: '#FFFFFF',
                                                        width: '23vw',
                                                        height: inputBoxHeight,
                                                        paddingLeft: '5px',
                                                        paddingRight: '30px',
                                                        fontFamily: 'geist',
                                                        boxSizing: 'border-box',
                                                        border: `${errorPassword == "" ? "" : "red 1px solid"}`
                                                    }}
                                                    type="password"
                                                    placeholder="Password"
                                                    disabled={loading}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />

                                                <FaEyeSlash
                                                    color="#C0C0C0"
                                                    style={{
                                                        width: '2vw',
                                                        position: 'absolute',
                                                        right: '10px',
                                                        top: '67%',
                                                        transform: 'translateY(-50%)',
                                                        cursor: 'pointer',
                                                        pointerEvents: 'auto',
                                                    }}
                                                />
                                            </div>
                                            
                                            <div>
                                                <Button
                                                    className="hover:cursor-pointer"
                                                    style={{
                                                        width: '23vw',
                                                        height: buttonHeight,
                                                        backgroundColor: '#254280',
                                                    }}
                                                    onClick={handleSubmit}
                                                    disabled={loading}
                                                >
                                                    {loading ? "Processing..." : "Set Password"}
                                                </Button>
                                            </div>

                                            <div
                                                style={{
                                                    width: '23vw',
                                                    height: '10px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: '35%',
                                                        height: '1px',
                                                        backgroundColor: 'white',
                                                        marginRight: '16px',
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        color: 'white',
                                                        margin: '8px',
                                                        fontSize: '1vw',
                                                        fontFamily: 'sans-serif',
                                                        fontWeight: 'normal',
                                                    }}
                                                >
                                                    <p style={{ color: 'white' }} className="text-[1vw]">
                                                        or
                                                    </p>
                                                </span>
                                                <div
                                                    style={{
                                                        width: '35%',
                                                        height: '1px',
                                                        backgroundColor: 'white',
                                                        marginLeft: '16px',
                                                    }}
                                                />
                                            </div>

                                            <div style={{}}>
                                                <Button
                                                    className="hover:cursor-pointer"
                                                    style={{
                                                        width: '23vw',
                                                        height: buttonHeight,
                                                        backgroundColor: 'white',
                                                    }}>
                                                    <div
                                                        className="flex gap-3 items-center"
                                                    >
                                                        <img src="/google-icon.svg" alt="google-icon" />
                                                        <p
                                                            style={{
                                                                paddingTop: '2px',
                                                            }}
                                                            className="pt-[1px] font-geist text-[.97vw] font-medium text-black">
                                                            Continue with Google
                                                        </p>
                                                    </div>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/*HERO IMAGE*/}
                                <div className="flex justify-end h-[100vh]">
                                    <img className="w-[100%] h-[100%] object-cover shadow-xl shadow-[-20px_10px_30px_rgba(0,0,0,0.5)]" src="/login-hero-image.svg" alt="hero-image" />
                                </div>
                            </div>
                        </div>
                    </div>
                </> :
                screenType === "handheld" ?
                    <>
                        <div className="h-[100vh] w-[100vw] overflow-hidden">
                            <div
                                className="h-[100vh] w-[100vw] flex flex-col items-center justify-center"
                                style={{
                                    margin: 0,
                                    padding: 0,
                                    background: 'linear-gradient(to bottom, #153FA3, #142345)',
                                }}
                            >

                                <div className="w-[100%] h-[100%] flex flex-col items-center justify-center">
                                    <img style={{ width: '7vh', marginBottom: '5px' }} src="/lv-logo.svg" alt="lv logo" />
                                    <div className="flex flex-col items-center" style={{ marginBottom: '15px' }}>
                                        <p style={{ marginBottom: '5px' }} className="font-tolkien text-white text-[4.3vw]">
                                            LA VERDAD CHRISITIAN COLLEGE
                                        </p>
                                        <p className="font-tiroTamil text-white text-[2.6vw]">
                                            MacArthur Highway, Sampaloc, Apalit, Pampanga 2016
                                        </p>
                                    </div>

                                    <div
                                        className="
                      w-100 h-100
                      [border-top-left-radius:32px]
                      [border-bottom-right-radius:32px]
                      shadow-xl"
                                        style={{
                                            border: '1px solid white'
                                        }}
                                    >

                                        <div className="w-[100%] h-[100%] flex flex-col gap-4 items-center justify-center">

                                            <div>
                                                <Input
                                                    style={{
                                                        background: '#FFFFFF',
                                                        width: '80vw',
                                                        height: inputBoxHeight,
                                                        paddingLeft: '5px',
                                                        font: 'geist',
                                                        border: `${error == "" ? "" : "red 1px solid"}`
                                                    }}
                                                    type="email"
                                                    placeholder="Email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    disabled={loading}
                                                />
                                                {error === "" ? "" :
                                                    <>
                                                        <Label>
                                                            <p style={{
                                                                fontFamily: 'geist',
                                                                font: 'regular',
                                                                color: '#D13B3B',
                                                                paddingTop: '2px'
                                                            }}
                                                                className="text-[1.5vh]"
                                                            >
                                                                {error}
                                                            </p>
                                                        </Label>
                                                    </>
                                                }
                                                <FaEyeSlash
                                                    color="#C0C0C0"
                                                    style={{
                                                        width: '10vw',
                                                        position: 'absolute',
                                                        right: '5px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        cursor: 'pointer',
                                                        pointerEvents: 'auto',
                                                    }}
                                                />
                                            </div>
                                            <div style={{ position: 'relative' }}>
                                                <Input
                                                    style={{
                                                        background: '#FFFFFF',
                                                        width: '80vw',
                                                        height: inputBoxHeight,
                                                        paddingLeft: '5px',
                                                        paddingRight: '30px',
                                                        fontFamily: 'geist',
                                                        boxSizing: 'border-box',
                                                        border: `${error == "" ? "" : "red 1px solid"}`
                                                    }}
                                                    type="password"
                                                    placeholder="New Password"
                                                    disabled={loading}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                                {error === "" ? "" :
                                                    <>
                                                        <Label>
                                                            <p style={{
                                                                fontFamily: 'geist',
                                                                font: 'regular',
                                                                color: '#D13B3B',
                                                                paddingTop: '2px'
                                                            }}
                                                                className="text-[1.5vh]"
                                                            >
                                                                {error}
                                                            </p>
                                                        </Label>
                                                    </>
                                                }
                                                <FaEyeSlash
                                                    color="#C0C0C0"
                                                    style={{
                                                        width: '10vw',
                                                        position: 'absolute',
                                                        right: '5px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        cursor: 'pointer',
                                                        pointerEvents: 'auto',
                                                    }}
                                                />
                                            </div>
                                            
                                            <div>
                                                <Button
                                                    className="hover:cursor-pointer"
                                                    style={{
                                                        width: '80vw',
                                                        height: buttonHeight,
                                                        backgroundColor: '#254280',
                                                    }}
                                                    onClick={handleSubmit}
                                                    disabled={loading}
                                                >
                                                    {loading ? "Processing..." : "Set Password"}
                                                </Button>
                                            </div>

                                            <div
                                                style={{
                                                    width: '90vw',
                                                    height: '10px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: '35%',
                                                        height: '1px',
                                                        backgroundColor: 'white',
                                                        marginRight: '16px',
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        color: '#4C4B4B',
                                                        margin: '8px',
                                                        fontSize: '1vw',
                                                        fontFamily: 'sans-serif',
                                                        fontWeight: 'normal',
                                                    }}
                                                >
                                                    <p style={{ color: 'white' }} className="text-[1.5vh]">
                                                        or
                                                    </p>
                                                </span>
                                                <div
                                                    style={{
                                                        width: '35%',
                                                        height: '1px',
                                                        backgroundColor: 'white',
                                                        marginLeft: '16px',
                                                    }}
                                                />
                                            </div>

                                            <div style={{}}>
                                                <Button
                                                    className="hover:cursor-pointer"
                                                    style={{
                                                        width: '80vw',
                                                        height: buttonHeight,
                                                        backgroundColor: 'white',
                                                    }}>
                                                    <div
                                                        className="flex gap-3 items-center"
                                                    >
                                                        <img src="/google-icon.svg" alt="google-icon" />
                                                        <p
                                                            style={{
                                                                paddingTop: '2px',
                                                            }}
                                                            className="pt-[1px] font-geist text-[3.5vw] font-medium text-black">
                                                            Continue with Google
                                                        </p>
                                                    </div>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </> : ""}
        </>
    )
}