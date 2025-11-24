import { logout } from "../../functions/logoutAuth"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"
import logo from "/lv-logo.svg";


export default function FreeMealClaim() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // redirect to login/home
    };
    return (
        <>
            <div className="bg-gradient-to-b from-[#153FA3] to-[#142345] h-screen w-full overflow-auto font-[geist]">
                <div className="text-white">
                <div className="flex flex-col w-1/2 h-full items-center justify-center">
                {/* Left Side */}
                
                    <div className="flex flex-col items-center">
                        <img src={logo} alt="" className="h-[155px] " style={{marginBottom: '50px'}}/>
                        <p className="text-[28px] font-tolkien text-white">LA VERDAD CHRISTIAN COLLEGE, INC.</p>
                        <p className="italic">MacArthur Highway, Sampaloc, Apalit, Pampanga 2016</p>
                    </div>
                    <div className="" style={{marginLeft: '30px'
                        , marginTop: '30px'
                    }}>
                        <p className="text-[16px]">Hi, Good Morning!</p>
                        <p className="text-[30px]">La Verdarians</p>
                    </div>

                    {/* Card */}
                    <div className=" border border-white/40 rounded-tl-[32px] rounded-br-[32px] w-[550px] bg-white/15 shadow-xl/20 "
                    style={{padding: '8px',
                        marginTop: '30px',
                    }}>
                        <p className="text-center text-[20px]">Scan now or Input ID</p>
                        <p className="border-b" style={{marginTop: '5px', marginBottom: '15px', marginLeft: '10px', marginRight: '10px'}}></p>

                        {/* Date */}
                        <p className="text-center text-[16px]">
                            October 2, 2025
                        </p>

                        {/* Time */}
                        <p className="text-center text-[65px] font-bold leading-none my-4">
                            10:30:12 AM
                        </p>

                        {/* Input */}
                        <div className="bg-white rounded-md mt-4 flex items-center text-black"
                        style={{marginBottom: '40px',
                            marginTop: '15px',
                            marginLeft: '50px',
                            marginRight: '50px',
                            padding: '10px',
                        }}>
                            <input
                                type="text"
                                placeholder="Student ID"
                                className="w-full outline-none placeholder-[#808080]"
                            />
                            <i className="fa-solid fa-id-card text-[#808080]"></i>
                        </div>

                        <p className="text-[10px] mt-6 opacity-70">Powered by: </p>
                        <p className="text-[13px]">BSIS4 Batch 2025</p>
                    </div>
                </div>
                </div>



            This is free meal claim for food server
            <Button onClick={handleLogout}>
                Log out
            </Button>
            </div>
        </>
    )
}