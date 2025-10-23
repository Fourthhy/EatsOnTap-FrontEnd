import { useState } from "react";
import { LayoutDashboard, Ticket, CalendarDays, ShoppingBag, BookOpen, LogOut } from "lucide-react";
import logo from "/pictures/logo.png";


const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);


  return (
    <div
      className={`${
        isExpanded ? "w-[288px]" : "w-[72px]"
      } h-screen bg-gradient-to-b from-[#263C70] to-[#142345] text-white flex flex-col justify-between transition-all duration-300`}
    >
      {/* Top Section */}
      <div>
        <div className="flex items-center justify-center mt-4 mb-6">
          <img
            src={logo}
            alt="Logo"
            className={`${isExpanded ? "w-14 h-14" : "w-10 h-10"} transition-all duration-300`}
          />
        </div>


        <p className={`text-gray-400 text-xs px-4 ${isExpanded ? "block" : "hidden"}`}>
          Main
        </p>


        {/* Nav Items */}
        <nav className="mt-2 space-y-1 ">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            text="Dashboard"
            expanded={isExpanded}
          />
          <SidebarItem
            icon={<Ticket size={20} />}
            text="Voucher Management"
            expanded={isExpanded}
            active
            fontWeight="font-semibold"
          />
          <SidebarItem
            icon={<CalendarDays size={20} />}
            text="Schedule of Student Eligibility"
            expanded={isExpanded}
          />
          <SidebarItem
            icon={<ShoppingBag size={20} />}
            text="Meal Recipient Orders"
            expanded={isExpanded}
          />
          <SidebarItem
            icon={<BookOpen size={20} />}
            text="Records"
            expanded={isExpanded}
          />
        </nav>
      </div>


      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="right-[-12px] bg-[#3a24a0] text-white p-1 rounded-full hover:bg-[#4b34c9] transition-all duration-300"
        >
          {isExpanded ? "<" : ">"}
        </button>


        <button className="flex items-center justify-center w-full gap-2 bg-white/30 hover:bg-[#52728F] py-3 rounded-lg transition">
          <LogOut size={18} />
          {isExpanded && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};


// Sidebar Item Component
const SidebarItem = ({ icon, text, expanded, active }) => {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 mx-3 rounded-lg cursor-pointer transition-all duration-200 ${
        active
          ? "bg-white text-[#2b1677]"
          : "hover:bg-[#52728F] text-gray-200 hover:text-white"
      }`}
    >
      {icon}
      {expanded && (
  <span
    className={`text-sm font-medium ${
      text === "Voucher Management"
        ? "bg-gradient-to-r from-[#263C70] to-[#4973D6] bg-clip-text text-transparent"
        : ""
    }`}
  >
    {text}
  </span>
)}


    </div>
  );
};


export default Sidebar;