import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "./components/ui/button";
import { Label } from "@/components/ui/label"
import { FaEyeSlash, FaEye, FaArrowLeft } from "react-icons/fa";
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
        if (isSubmitDisabled) return;

        setError('');
        setErrorPassword('');
        setSuccess('');
        setLoading(true);

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        try {
            const data = await loginApi({
                email: trimmedEmail,
                password: trimmedPassword
            });

            // 🟢 THE FIX: Standardize data shape for the Header (No photo for manual login)
            const enrichedData = {
                ...data,
                photoURL: null,
                fullName: data.first_name ? `${data.first_name} ${data.last_name}` : 'Eat\'s on Tap User'
            };

            localStorage.setItem("userInformation", JSON.stringify(enrichedData));
            console.log('INFORMATION SAVED TO STORAGE!', enrichedData);

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
        if (loading) return;

        setError('');
        setErrorPassword('');
        setSuccess('');
        setLoading(true);

        try {
            const result = await signInWithPopup(auth, googleProvider);

            const idToken = await result.user.getIdToken();
            const googleEmail = result.user.email;

            // 🟢 THE FIX: Grab the Google profile details
            const googlePhoto = result.user.photoURL;
            const googleName = result.user.displayName;

            const data = await loginApi({
                email: googleEmail,
                idToken: idToken
            });

            // 🟢 THE FIX: Merge the Google photo and name into your data object
            const enrichedData = {
                ...data,
                photoURL: googlePhoto,
                fullName: data.first_name ? `${data.first_name} ${data.last_name}` : googleName
            };

            localStorage.setItem("userInformation", JSON.stringify(enrichedData));
            console.log('GOOGLE INFORMATION SAVED TO STORAGE!', enrichedData);

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
                    case 'STUDENT': targetPath = '/student/dashboard'; break;
                    default:
                        setError('Unknown user role.');
                        setLoading(false);
                        return;
                }
            }

            window.location.replace(targetPath);

        } catch (error) {
            console.error("Firebase/Unified Login Error:", error);

            if (
                error.code === 'auth/popup-closed-by-user' ||
                error.code === 'auth/cancelled-popup-request' ||
                (error.message && error.message.includes('closed by user'))
            ) {
                console.log("Google sign-in was cancelled by the user.");
                return;
            }

            setError(error.message || "An error occurred during Google Sign-In.");
            setTimeout(() => {
                setError('');
            }, 3000);

        } finally {
            setLoading(false);
        }
    };

    // 🟢 ENTER KEY HANDLER: Submit login on Enter keypress
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isSubmitDisabled) {
            e.preventDefault();
            handleSubmit();
        }
    };

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
        <div className="login-page" onKeyDown={handleKeyDown}>
            <div className="login-page" style={{ background: 'linear-gradient(to bottom, #153FA3, #142345)', position: 'relative' }}>
                {/* Back to Landing Page button */}
                <button
                    className="login-back-btn"
                    onClick={() => navigate('/')}
                    aria-label="Back to landing page"
                >
                    <FaArrowLeft />
                </button>

                <div className="login-grid">
                    {/* Left side — form */}
                    <div className="login-form-side">
                        {/* Branding */}
                        <div className="login-branding">
                            <img className="login-logo" src="/lv-logo.svg" alt="lv logo" />
                            <p className="font-tolkien text-white login-college-name">LA VERDAD CHRISTIAN COLLEGE</p>
                            <p className="font-tiroTamil text-white login-college-address">MacArthur Highway, Sampaloc, Apalit, Pampanga 2016</p>
                        </div>

                        {/* Form card */}
                        <div className="login-card">
                            <div className="login-card-inner">
                                {/* Email field — shown with label on laptop, without on handheld */}
                                <div>
                                    <div className="login-label-wrap" style={{ color: "#FFF", fontFamily: "geist", paddingBottom: "5px" }}>
                                        <Label style={{ fontWeight: 400 }}>Email</Label>
                                    </div>
                                    <Input
                                        className="login-input"
                                        style={{
                                            background: '#FFFFFF',
                                            paddingLeft: '5px',
                                            font: 'geist',
                                            border: error !== "" ? "red 1px solid" : success !== "" ? "#4BB543 1px solid" : ""
                                        }}
                                        type="email"
                                        placeholder="example@laverdad.edu.ph"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                    <FeedbackMessage />
                                </div>

                                {/* Password field */}
                                <div style={{ position: 'relative' }}>
                                    <div className="login-label-wrap" style={{ color: "#FFF", fontFamily: "geist", paddingBottom: "5px" }}>
                                        <Label style={{ fontWeight: 400 }}>Password</Label>
                                    </div>
                                    <Input
                                        className="login-input"
                                        style={{
                                            background: '#FFFFFF',
                                            paddingLeft: '5px',
                                            paddingRight: '40px',
                                            fontFamily: 'geist',
                                            boxSizing: 'border-box',
                                            border: errorPassword === "" ? "" : "red 1px solid"
                                        }}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        disabled={loading}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    {showPassword ?
                                        <FaEye onClick={() => setShowPassword(false)} color="#C0C0C0" className="login-eye-icon" />
                                        :
                                        <FaEyeSlash onClick={() => setShowPassword(true)} color="#C0C0C0" className="login-eye-icon" />
                                    }
                                </div>

                                {/* Forgot password */}
                                <p onClick={handleForgotPassword} className="login-forgot-password font-geist text-white hover:underline hover:cursor-pointer">
                                    Forgot Password?
                                </p>

                                {/* Login button */}
                                <Button
                                    disabled={isSubmitDisabled}
                                    className={`login-btn ${isSubmitDisabled ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer"}`}
                                    style={{ backgroundColor: '#254280' }}
                                    onClick={handleSubmit}
                                >
                                    {loading ? "Loading..." : "Login"}
                                </Button>

                                {/* Divider */}
                                <div className="login-divider">
                                    <div className="login-divider-line" />
                                    <span className="login-divider-text">or</span>
                                    <div className="login-divider-line" />
                                </div>

                                {/* Google button */}
                                <Button
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className={`login-btn ${loading ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer"}`}
                                    style={{ backgroundColor: 'white' }}
                                >
                                    <div className="flex gap-3 items-center">
                                        <img src="/google-icon.svg" alt="google-icon" />
                                        <p className="login-google-text font-geist font-medium text-black" style={{ paddingTop: '2px' }}>
                                            {loading ? "Signing in..." : "Continue with Google"}
                                        </p>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right side — hero image (only on laptop+) */}
                    <div className="login-hero-side">
                        <img className="login-hero-image" src="/login-hero-image.svg" alt="hero-image" />
                    </div>
                </div>
            </div>
        </div>
    );
}