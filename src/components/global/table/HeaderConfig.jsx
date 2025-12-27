import { 
    Utensils, 
    CalendarDays, 
    Wallet, 
    FileDown, 
    Calendar, 
    Clock 
} from "lucide-react";

 const DEFAULT_NOTIFICATIONS = [
    {
        date: "Today",
        data: [
            { notificationType: "Meal Request", description: "Ms. Santos submitted a meal request for 1-Luke", time: "10:23 AM" },
            { notificationType: "Credit Change", description: "Virtual Credit value updated to ₱70.00", time: "09:00 AM" }
        ]
    },
    {
        date: "December 25, 2025",
        data: [
            { notificationType: "Event Meal Request", description: "Request for 'Sports Fest' approved", time: "2:30 PM" },
            { notificationType: " Report", description: "Weekly consumption report downloaded", time: "11:15 AM" }
        ]
    },
    {
        date: "December 24, 2025",
        data: [
            { notificationType: "Upcoming Event", description: "System Maintenance scheduled for midnight", time: "5:00 PM" }
        ]
    }
];

 const getNotificationConfig = (type) => {
    switch (type) {
        case 'Meal Request': return { icon: Utensils, color: '#3B82F6', bg: '#EFF6FF' };
        case 'Event Meal Request': return { icon: CalendarDays, color: '#F68A3A', bg: '#FFF7ED' };
        case 'Credit Change': return { icon: Wallet, color: '#EAB308', bg: '#FEFCE8' };
        case ' Report': return { icon: FileDown, color: '#6B7280', bg: '#F3F4F6' };
        case 'Upcoming Event': return { icon: Calendar, color: '#8B5CF6', bg: '#F5F3FF' };
        default: return { icon: Clock, color: '#6B7280', bg: '#F3F4F6' };
    }
};

// If the file is named headerConfig.jsx and is in the same folder:
export { DEFAULT_NOTIFICATIONS, getNotificationConfig }