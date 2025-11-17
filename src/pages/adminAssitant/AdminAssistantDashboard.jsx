import { logout } from "../../functions/logoutAuth"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"

export default function AdminAssistantDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // redirect to login/home
    };
    return (
        <div className="bg-[#F7F9F9] p-[5px] h-screen w-full overflow-auto font-[geist]">\
        <div className="flex flex-row gap-[20px]" 
        style={{marginTop: '50px',
                    marginLeft: '100px',
                    marginBottom: '30px',
                    marginRight: '100px'
            }}>

            {/* Left Side*/}
            <div className="flex flex-col gap-[10px] w-full">
            
                <div className="w-full max-w-[743px] flex flex-col items-start gap-[5px] bg-white rounded-[8px] shadow-md mx-auto mt-6"
                style={{padding: '25px'}}>
                    <p className="text-[23px] font-bold">Good Morning!</p>
                    <p className="text-[14px] text-[#4C4B4B]">Manage meal schedules and student eligibility</p>
                </div>

                {/*3 Cards Container */}
                <div className="flex gap-[10px]">
                    {/* 1st Card*/}
                    <div className="w-full max-w-[242px] bg-white rounded-lg shadow-md p-10 "
                    style={{padding: '10px'}}>
                    {/* Title */}
                    <p className="text-[13px] font-medium text-[#4C4B4B] mb-1">Total Claims (Today)</p>
                    {/* Value */}
                    <p className="text-[20px] font-medium text-black mb-1">215</p>
    
                    {/* Subtext */}
                    <p className="text-[11px] font-light text-[#4C4B4B]">12% vs. yesterday</p>
                    </div>  


                    {/* 2nd Card*/}
                    <div className="w-full max-w-[242px] bg-white rounded-lg shadow-md p-10 mx-5"
                    style={{padding: '10px'}}>
                    
                    <p className="text-[13px] font-medium text-[#4C4B4B] mb-1">Unclaimed (Today)</p> {/* Title */}
                    <p className="text-[20px] font-medium text-black mb-1">32</p>   {/* Value */}
                    <p className="text-[11px] font-light text-[#4C4B4B]">3 yesterday</p> {/* Subtext */}
                    </div>


                    {/* 3rd Card*/}
                    <div className="w-full max-w-[242px] bg-white rounded-lg shadow-md p-10 mx-5"
                    style={{padding: '10px'}}>
                    
                    <p className="text-[13px] font-medium text-[#4C4B4B] mb-1">Eligible (Today)</p> {/* Title */}
                    <p className="text-[20px] font-medium text-black mb-1">432</p>   {/* Value */}
                    <p className="text-[11px] font-light text-[#4C4B4B]">20 not eligible</p> {/* Subtext */}
                    </div>

                </div>

                <div className="text-[14px] font-semibold">
                    Daily Schedule
                </div>


                {/* Table Container */}
                <div className="flex flex-col gap-[10px]">
                    <div className="flex flex-row gap-[10px]">
                        {/* card 1 */}
                        <div className="w-full max-w-[367px] bg-[#D5E4FF] rounded-lg shadow-md" 
                        style={{padding: '20px'}}>
                            <p className="text-end text-[12px]">View</p>
                            <p className=" text-center text-[50px] items-center font-medium leading-[65px] bg-gradient-to-b from-[#0070FF] to-[#004399] bg-clip-text text-transparent">324</p> {/* Value */}
                            <p className="text-center text-[16px] font-normal leading-[21px] text-[#4C4B4B] mb-2">Eligible</p> {/* Label */}
                            <p className="text-[12px] font-normal leading-[16px] text-[#4C4B4B]">Monday</p>  {/* Day */}
                            <p className="text-[14px] font-medium leading-[18px] text-black">Aug 23, 2025</p> {/* Date */}
                        </div>  

                        {/* card 2 */}
                        <div className="w-full max-w-[367px] bg-[#D5DCFF] rounded-lg shadow-md" 
                        style={{padding: '20px'}}>
                            <p className="text-end text-[12px]">View</p>
                            <p className=" text-center text-[50px] items-center font-medium leading-[65px] bg-gradient-to-b from-[#0070FF] to-[#004399] bg-clip-text text-transparent">324</p> {/* Value */}
                            <p className="text-center text-[16px] font-normal leading-[21px] text-[#4C4B4B] mb-2">Eligible</p> {/* Label */}
                            <p className="text-[12px] font-normal leading-[16px] text-[#4C4B4B]">Tuesday</p>  {/* Day */}
                            <p className="text-[14px] font-medium leading-[18px] text-black">Aug 24, 2025</p> {/* Date */}
                        </div>  
                    </div>
                    
                    {/* 2nd Row of Cards */}
                    <div className="flex flex-row gap-[10px]">
                        {/* card 1 */}
                        <div className="w-full max-w-[367px] bg-[#D5EBFF] rounded-lg shadow-md" 
                        style={{padding: '20px'}}>
                            <p className="text-end text-[12px]">View</p>
                            <p className=" text-center text-[50px] items-center font-medium leading-[65px] bg-gradient-to-b from-[#0070FF] to-[#004399] bg-clip-text text-transparent">324</p> {/* Value */}
                            <p className="text-center text-[16px] font-normal leading-[21px] text-[#4C4B4B] mb-2">Eligible</p> {/* Label */}
                            <p className="text-[12px] font-normal leading-[16px] text-[#4C4B4B]">Monday</p>  {/* Day */}
                            <p className="text-[14px] font-medium leading-[18px] text-black">Aug 25, 2025</p> {/* Date */}
                        </div>  

                        {/* card 2 */}
                        <div className="w-full max-w-[367px] bg-[#D5E7FF] rounded-lg shadow-md" 
                        style={{padding: '20px'}}>
                            <p className="text-end text-[12px]">View</p>
                            <p className=" text-center text-[50px] items-center font-medium leading-[65px] bg-gradient-to-b from-[#0070FF] to-[#004399] bg-clip-text text-transparent">324</p> {/* Value */}
                            <p className="text-center text-[16px] font-normal leading-[21px] text-[#4C4B4B] mb-2">Eligible</p> {/* Label */}
                            <p className="text-[12px] font-normal leading-[16px] text-[#4C4B4B]">Tuesday</p>  {/* Day */}
                            <p className="text-[14px] font-medium leading-[18px] text-black">Aug 26, 2025</p> {/* Date */}
                        </div>  
                    </div>
                    
                    {/* 3rd Row of Cards */}
                    <div className="flex flex-row gap-[10px]">
                        {/* card 1 */}
                        <div className="w-full max-w-[367px] bg-[#D5EEFF] rounded-lg shadow-md" 
                        style={{padding: '20px'}}>
                            <p className="text-end text-[12px]">View</p>
                            <p className=" text-center text-[50px] items-center font-medium leading-[65px] bg-gradient-to-b from-[#0070FF] to-[#004399] bg-clip-text text-transparent">324</p> {/* Value */}
                            <p className="text-center text-[16px] font-normal leading-[21px] text-[#4C4B4B] mb-2">Eligible</p> {/* Label */}
                            <p className="text-[12px] font-normal leading-[16px] text-[#4C4B4B]">Monday</p>  {/* Day */}
                            <p className="text-[14px] font-medium leading-[18px] text-black">Aug 27, 2025</p> {/* Date */}
                        </div>  

                        {/* card 2 */}
                        <div className="w-full max-w-[367px] bg-[#D5E9FF] rounded-lg shadow-md" 
                        style={{padding: '20px'}}>
                            <p className="text-end text-[12px]">View</p>
                            <p className=" text-center text-[50px] items-center font-medium leading-[65px] bg-gradient-to-b from-[#0070FF] to-[#004399] bg-clip-text text-transparent">324</p> {/* Value */}
                            <p className="text-center text-[16px] font-normal leading-[21px] text-[#4C4B4B] mb-2">Eligible</p> {/* Label */}
                            <p className="text-[12px] font-normal leading-[16px] text-[#4C4B4B]">Tuesday</p>  {/* Day */}
                            <p className="text-[14px] font-medium leading-[18px] text-black">Aug 28, 2025</p> {/* Date */}
                        </div>  
                    </div>
                </div>
            </div>
            
            {/* Right Side*/}
            <div className="flex flex-col max-w-[400px] w-full gap-[10px]">
                <div className="bg-white shadow-md rounded-lg" 
                style={{padding: '20px'}}>
                    <p className="text-[13px]">Quick Actions</p>
                </div>
            </div>

            
            </div>
        </div>
    )
}