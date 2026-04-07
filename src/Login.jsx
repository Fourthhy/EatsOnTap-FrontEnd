import { useEffect, useState } from "react";
import { useBreakpoint } from "use-breakpoint"
import { Input } from "@/components/ui/input"
import { Button } from "./components/ui/button";
import { Label } from "@/components/ui/label"
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loginApi } from "./functions/loginAuth"
import { resetPassword } from "./functions/admin/resetPassword";
import { useData } from "./context/DataContext";

// 🟢 NEW: Import Firebase functions and your local Firebase config
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './config/firebase';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [errorPassword, setErrorPassword] = useState('')
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const loginHeader = "Login - Eat's on Tap";

    // 🟢 LOGIC: Button is disabled if loading OR email is empty OR password is empty
    const isSubmitDisabled = loading || !email || !password;

    // 🟢 LOGIN GUARD: Check for existing token on mount
    useEffect(() => {
        document.title = loginHeader;

        const token = localStorage.getItem('authToken');

        if (token) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [navigate]);

    // 🟢 FORGOT PASSWORD HANDLER
    const handleForgotPassword = async () => {
        setError('');
        setErrorPassword('');
        setSuccess('');

        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            setError('Please enter your email address above to reset your password.');
            return;
        }

        setLoading(true);
        try {
            const response = await resetPassword(trimmedEmail);
            setSuccess(response.message || "An email has been sent to your account.");
        } catch (err) {
            setError(err.message || "Failed to send reset link.");
        } finally {
            setLoading(false);
        }
    };

    // 🟢 LOGIN HANDLER (Standard Email/Password)
    const handleSubmit = async () => {
        // Double check in case the button was somehow forced
        if (isSubmitDisabled) return;

        setError('');
        setErrorPassword('');
        setSuccess('');
        setLoading(true);

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        try {
            const data = await loginApi(trimmedEmail, trimmedPassword);

            localStorage.setItem("userInformation", JSON.stringify(data));
            console.log('INFORMATION SAVED TO STORAGE!', data);

            let targetPath = '/';
            // window.location.replace(targetPath); // Removed to prevent early redirect

            if (data.section) {
                targetPath = `/classAdviser/${data.section}/${data.userID}/submitMealList`;
            } else {
                switch (data.role) {
                    case 'ADMIN': targetPath = '/admin/dashboard'; break;
                    case 'ADMIN-ASSISTANT': targetPath = '/adminAssistant'; break;
                    case 'CANTEEN-STAFF': targetPath = '/canteenStaff'; break;
                    case 'CHANCELLOR': targetPath = '/chancellor'; break;
                    case 'FOOD-SERVER': targetPath = '/foodServer'; break;
                    case 'SUPER-ADMIN': targetPath = '/superAdmin'; break;
                    default:
                        setError('Unknown user role.');
                        setLoading(false);
                        return;
                }
            }

            window.location.replace(targetPath);

        } catch (error) {
            setError(error.message || 'Network Error');
            setTimeout(() => {
                setError('');
                setLoading(false);
            }, 3000);
        }
    };

    // 🟢 NEW: GOOGLE FIREBASE LOGIN HANDLER
    const handleGoogleLogin = async () => {
        setError('');
        setErrorPassword('');
        setSuccess('');
        setLoading(true);

        const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

        try {
            // 1. Pop up the Google Login window via Firebase
            const result = await signInWithPopup(auth, googleProvider);

            // 2. Grab the secure token Firebase assigns to the user
            const idToken = await result.user.getIdToken();

            // 3. Shoot it over to your secure Express backend
            const response = await fetch(`${VITE_BASE_URL}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken })
            });

            const data = await response.json();

            // Check if backend rejected it (e.g., Unregistered email or wrong domain)
            if (!response.ok) {
                throw new Error(data.message || "Failed to authenticate with server.");
            }

            // 4. Exact same routing logic as standard login!
            localStorage.setItem("userInformation", JSON.stringify(data));
            console.log('GOOGLE INFORMATION SAVED TO STORAGE!', data);

            let targetPath = '/';

            if (data.section) {
                targetPath = `/classAdviser/${data.section}/${data.userID}/submitMealList`;
            } else {
                switch (data.role) {
                    case 'ADMIN': targetPath = '/admin/dashboard'; break;
                    case 'ADMIN-ASSISTANT': targetPath = '/adminAssistant'; break;
                    case 'CANTEEN-STAFF': targetPath = '/canteenStaff'; break;
                    case 'CHANCELLOR': targetPath = '/chancellor'; break;
                    case 'FOOD-SERVER': targetPath = '/foodServer'; break;
                    case 'SUPER-ADMIN': targetPath = '/superAdmin'; break;
                    case 'STUDENT': targetPath = '/student/dashboard'; break; // Added just in case
                    default:
                        setError('Unknown user role.');
                        setLoading(false);
                        return;
                }
            }

            window.location.replace(targetPath);

        } catch (error) {
            console.error("Firebase Login Error:", error);

            // 🟢 THE FIX: Safely ignore the "popup closed" errors
            if (
                error.code === 'auth/popup-closed-by-user' ||
                error.code === 'auth/cancelled-popup-request' ||
                (error.message && error.message.includes('closed by user'))
            ) {
                console.log("Google sign-in was cancelled by the user.");
                // We just return silently without setting any red error text
                return;
            }

            // For all other ACTUAL errors (like network issues), show the error message
            setError(error.message || "An error occurred during Google Sign-In.");
            setTimeout(() => {
                setError('');
            }, 3000);

        } finally {
            setLoading(false);
        }
    };

    // --- Breakpoint & UI Logic ---
    const BREAKPOINTS = {
        'mobile-md': 375,
        'mobile-lg': 425,
        'tablet': 768,
        'laptop-md': 1024,
        'laptop-lg': 1440,
    };

    const { breakpoint } = useBreakpoint(BREAKPOINTS, 'mobile-md');

    const buttonHeight = breakpoint === 'laptop-lg' ? '4vh' : breakpoint === 'laptop-md' ? '6vh' : '4vh';
    const inputBoxHeight = breakpoint === 'laptop-lg' ? '4vh' : breakpoint === 'laptop-md' ? '6vh' : '5vh';

    const screenType =
        breakpoint === 'laptop-md' || breakpoint === 'laptop-lg' ? "laptop" :
            breakpoint === 'mobile-md' || breakpoint === 'mobile-lg' || breakpoint === "tablet" ? "handheld" : "";

    const FeedbackMessage = () => (
        <>
            {error !== "" && (
                <Label>
                    <p style={{ fontFamily: 'geist', color: '#D13B3B', paddingTop: '3px', paddingLeft: '5px' }} className="text-xs">
                        {error}
                    </p>
                </Label>
            )}
            {success !== "" && (
                <Label>
                    <p style={{ fontFamily: 'geist', color: '#4BB543', paddingTop: '3px', paddingLeft: '5px' }} className="text-xs">
                        {success}
                    </p>
                </Label>
            )}
        </>
    );

    return (
        <>
            {screenType === "laptop" ?
                <div className="h-[100vh] w-[100vw]">
                    <div className="h-[100vh] w-[100vw]" style={{ margin: 0, padding: 0, background: 'linear-gradient(to bottom, #153FA3, #142345)' }}>
                        <div className="grid grid-cols-[40vw_60vw]">
                            <div className="w-[100%] h-[100%] flex flex-col items-center justify-center">
                                <div className="flex flex-col items-center" style={{ marginBottom: '20px' }}>
                                    <img style={{ width: '5vw', marginBottom: '10px' }} src="/lv-logo.svg" alt="lv logo" />
                                    <p style={{ marginBottom: '3px' }} className="font-tolkien text-white text-[1.6vw]">LA VERDAD CHRISTIAN COLLEGE</p>
                                    <p className="font-tiroTamil text-white text-[1.5vh]"> MacArthur Highway, Sampaloc, Apalit, Pampanga 2016 </p>
                                </div>
                                <div className="w-100 h-100 [border-top-left-radius:32px] [border-bottom-right-radius:32px]" style={{ backgroundColor: '#ffffff26', boxShadow: '0 0 25px rgba(0, 0, 0, 0.25)' }}>
                                    <div className="w-[100%] h-[100%] flex flex-col gap-4 items-center justify-center">
                                        <div>
                                            <div style={{ color: "#FFF", fontFamily: "geist", paddingBottom: "5px" }}> <Label style={{ fontWeight: 400 }}>Email</Label> </div>
                                            <Input
                                                style={{ background: '#FFFFFF', width: '23vw', height: inputBoxHeight, paddingLeft: '5px', font: 'geist', border: error !== "" ? "red 1px solid" : success !== "" ? "#4BB543 1px solid" : "" }}
                                                type="email" placeholder="example@laverdad.edu.ph" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}
                                            />
                                            <FeedbackMessage />
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <div style={{ color: "#FFF", fontFamily: "geist", paddingBottom: "5px" }}> <Label style={{ fontWeight: 400 }}>Password</Label> </div>
                                            <Input
                                                style={{ background: '#FFFFFF', width: '23vw', height: inputBoxHeight, paddingLeft: '5px', paddingRight: '30px', fontFamily: 'geist', boxSizing: 'border-box', border: errorPassword === "" ? "" : "red 1px solid" }}
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Password" disabled={loading} value={password} onChange={(e) => setPassword(e.target.value)}
                                            />
                                            {showPassword ?
                                                <FaEye onClick={() => setShowPassword(false)} color="#C0C0C0" style={{ width: '2vw', position: 'absolute', right: '10px', top: '67%', transform: 'translateY(-50%)', cursor: 'pointer' }} />
                                                :
                                                <FaEyeSlash onClick={() => setShowPassword(true)} color="#C0C0C0" style={{ width: '2vw', position: 'absolute', right: '10px', top: '67%', transform: 'translateY(-50%)', cursor: 'pointer' }} />
                                            }
                                        </div>
                                        <p onClick={handleForgotPassword} className="w-[23vw] text-right font-geist text-white text-[.97vw] hover:underline hover:cursor-pointer"> Forgot Password? </p>

                                        <Button
                                            disabled={isSubmitDisabled}
                                            className={isSubmitDisabled ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer"}
                                            style={{ width: '23vw', height: buttonHeight, backgroundColor: '#254280' }}
                                            onClick={handleSubmit}
                                        >
                                            {loading ? "Loading..." : "Login"}
                                        </Button>

                                        <div style={{ width: '23vw', height: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ width: '35%', height: '1px', backgroundColor: 'white', marginRight: '16px' }} />
                                            <span style={{ color: 'white', margin: '8px', fontSize: '1vw', fontFamily: 'sans-serif' }}>or</span>
                                            <div style={{ width: '35%', height: '1px', backgroundColor: 'white', marginLeft: '16px' }} />
                                        </div>

                                        {/* 🟢 NEW: Laptop Google Login Button Wired Up */}
                                        <Button
                                            onClick={handleGoogleLogin}
                                            disabled={loading}
                                            className={loading ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer"}
                                            style={{ width: '23vw', height: buttonHeight, backgroundColor: 'white' }}
                                        >
                                            <div className="flex gap-3 items-center">
                                                <img src="/google-icon.svg" alt="google-icon" />
                                                <p style={{ paddingTop: '2px' }} className="pt-[1px] font-geist text-[.97vw] font-medium text-black">
                                                    {loading ? "Signing in..." : "Continue with Google"}
                                                </p>
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end h-[100vh]">
                                <img className="w-[100%] h-[100%] object-cover shadow-xl" src="/login-hero-image.svg" alt="hero-image" />
                            </div>
                        </div>
                    </div>
                </div>
                : screenType === "handheld" ?
                    <div className="h-[100vh] w-[100vw] overflow-hidden">
                        <div className="h-[100vh] w-[100vw] flex flex-col items-center justify-center" style={{ margin: 0, padding: 0, background: 'linear-gradient(to bottom, #153FA3, #142345)' }}>
                            <div className="w-[100%] h-[100%] flex flex-col items-center justify-center">
                                <img style={{ width: '7vh', marginBottom: '5px' }} src="/lv-logo.svg" alt="lv logo" />
                                <div className="flex flex-col items-center" style={{ marginBottom: '15px' }}>
                                    <p style={{ marginBottom: '5px' }} className="font-tolkien text-white text-[4.3vw]">LA VERDAD CHRISTIAN COLLEGE</p>
                                    <p className="font-tiroTamil text-white text-[2.6vw]">macArthur Highway, Sampaloc, Apalit, Pampanga 2016</p>
                                </div>
                                <div className="w-100 h-100 [border-top-left-radius:32px] [border-bottom-right-radius:32px] shadow-xl" style={{ border: '1px solid white' }}>
                                    <div className="w-[100%] h-[100%] flex flex-col gap-4 items-center justify-center">
                                        <Input
                                            style={{ background: '#FFFFFF', width: '80vw', height: inputBoxHeight, paddingLeft: '5px', font: 'geist', border: error !== "" ? "red 1px solid" : success !== "" ? "#4BB543 1px solid" : "" }}
                                            type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}
                                        />
                                        <FeedbackMessage />
                                        <div style={{ position: 'relative' }}>
                                            <Input
                                                style={{ background: '#FFFFFF', width: '80vw', height: inputBoxHeight, paddingLeft: '5px', paddingRight: '30px', fontFamily: 'geist', boxSizing: 'border-box', border: error === "" ? "" : "red 1px solid" }}
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Password" disabled={loading} value={password} onChange={(e) => setPassword(e.target.value)}
                                            />
                                            {showPassword ?
                                                <FaEye onClick={() => setShowPassword(false)} color="#C0C0C0" style={{ width: '10vw', position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} />
                                                :
                                                <FaEyeSlash onClick={() => setShowPassword(true)} color="#C0C0C0" style={{ width: '10vw', position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} />
                                            }
                                        </div>
                                        <p onClick={handleForgotPassword} className="w-[80vw] text-right font-geist text-white text-[3.4vw] hover:underline hover:cursor-pointer"> Forgot Password? </p>

                                        <Button
                                            disabled={isSubmitDisabled}
                                            className={isSubmitDisabled ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer"}
                                            style={{ width: '80vw', height: buttonHeight, backgroundColor: '#254280' }}
                                            onClick={handleSubmit}
                                        >
                                            {loading ? "Loading..." : "Login"}
                                        </Button>

                                        <div style={{ width: '90vw', height: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ width: '35%', height: '1px', backgroundColor: 'white', marginRight: '16px' }} />
                                            <span style={{ color: 'white', margin: '8px', fontSize: '1.5vh', fontFamily: 'sans-serif' }}>or</span>
                                            <div style={{ width: '35%', height: '1px', backgroundColor: 'white', marginLeft: '16px' }} />
                                        </div>

                                        {/* 🟢 NEW: Handheld Google Login Button Wired Up */}
                                        <Button
                                            onClick={handleGoogleLogin}
                                            disabled={loading}
                                            className={loading ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer"}
                                            style={{ width: '80vw', height: buttonHeight, backgroundColor: 'white' }}
                                        >
                                            <div className="flex gap-3 items-center">
                                                <img src="/google-icon.svg" alt="google-icon" />
                                                <p style={{ paddingTop: '2px' }} className="pt-[1px] font-geist text-[3.5vw] font-medium text-black">
                                                    {loading ? "Signing in..." : "Continue with Google"}
                                                </p>
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    : ""}
        </>
    )
}