// src/data/mockDashboardData.js

export const MOCK_DASHBOARD_DATA = {
    // 1. DATA FOR TAB 1 (TODAY)
    today: [
        {
            barChartData: [
                { date: "January 28, 2026", dayOfWeek: "Monday", dish1: "Shanghai", dish2: "Gulay", Claimed: 390, Unclaimed: 1250 },
                { date: "January 28, 2026", dayOfWeek: "Tuesday", dish1: "Burger Steak", dish2: "", Claimed: 420, Unclaimed: 1503 },
                { date: "January 28, 2026", dayOfWeek: "Wednesday", dish1: "Menudo", dish2: "Adobo", Claimed: 100, Unclaimed: 2175 },
                { date: "January 28, 2026", dayOfWeek: "Thursday", dish1: "Fried Chicken", dish2: "Ampalaya", Claimed: 200, Unclaimed: 1863 },
                { date: "January 28, 2026", dayOfWeek: "Friday", dish1: "Tortang Talong", dish2: "Ampalaya", Claimed: 632, Unclaimed: 1698 },
                { date: "January 28, 2026", dayOfWeek: "Saturday", dish1: "Hotdog", dish2: "Egg", Claimed: 0, Unclaimed: 423 },
            ]
        },
        {
            trendsData: [
                { "dataSpan": "Monday", "Pre-packed Food": 200, "Customized Order": 200, "Unused vouchers": 300 },
                { "dataSpan": "Tuesday", "Pre-packed Food": 1300, "Customized Order": 300, "Unused vouchers": 100 },
                { "dataSpan": "Wednesday", "Pre-packed Food": 1200, "Customized Order": 100, "Unused vouchers": 500 },
                { "dataSpan": "Thursday", "Pre-packed Food": 900, "Customized Order": 50, "Unused vouchers": 50 },
                { "dataSpan": "Friday", "Pre-packed Food": 1500, "Customized Order": 450, "Unused vouchers": 150 },
                { "dataSpan": "Saturday", "Pre-packed Food": 1800, "Customized Order": 600, "Unused vouchers": 200 }
            ]
        },
        {
            TADMCdata: [
                { Day: 'Mon 1', AcceptableRange: [58, 62], TADMC: 60.50 },
                { Day: 'Tue 2', AcceptableRange: [58, 62], TADMC: 61.25 },
                { Day: 'Wed 3', AcceptableRange: [58, 62], TADMC: 59.80 },
                { Day: 'Thu 4', AcceptableRange: [58, 62], TADMC: 57.90 },
                { Day: 'Fri 5', AcceptableRange: [58, 62], TADMC: 63.50 },
                { Day: 'Sat 6', AcceptableRange: [58, 62], TADMC: 61.90 },
                { Day: 'Mon 8', AcceptableRange: [58, 62], TADMC: 61.00 },
            ]
        },
        {
            CURdata: [
                { Day: 'Mon 1', AcceptableRange: [90, 100], TADMC: 92.50 },
                { Day: 'Tue 2', AcceptableRange: [90, 100], TADMC: 98.25 },
                { Day: 'Wed 3', AcceptableRange: [90, 100], TADMC: 94.80 },
                { Day: 'Thu 4', AcceptableRange: [90, 100], TADMC: 89.90 },
                { Day: 'Fri 5', AcceptableRange: [90, 100], TADMC: 101.50 },
                { Day: 'Sat 6', AcceptableRange: [90, 100], TADMC: 96.90 },
                { Day: 'Mon 8', AcceptableRange: [90, 100], TADMC: 95.00 },
            ]
        },
        {
            OCFdata: [
                { Day: 'Mon 1', AcceptableRange: [0, 15], TADMC: 5.50 },
                { Day: 'Tue 2', AcceptableRange: [0, 15], TADMC: 12.25 },
                { Day: 'Wed 3', AcceptableRange: [0, 15], TADMC: 8.80 },
                { Day: 'Thu 4', AcceptableRange: [0, 15], TADMC: 1.90 },
                { Day: 'Fri 5', AcceptableRange: [0, 15], TADMC: 16.50 },
                { Day: 'Sat 6', AcceptableRange: [0, 15], TADMC: 10.90 },
                { Day: 'Mon 8', AcceptableRange: [0, 15], TADMC: 7.00 },
            ]
        }
    ],

    // 2. DATA FOR TAB 2 (WEEKLY)
    weekly: [
        {
            barChartData: [
                { dayOfWeek: "Week 1", dish1: "Burger Steak", dish2: "Adobo", Claimed: 2000, Unclaimed: 500 },
                { dayOfWeek: "Week 2", dish1: "Menudo", dish2: "Fried Chicken", Claimed: 1500, Unclaimed: 700 },
                { dayOfWeek: "Week 3", dish1: "Pork Sinigang", dish2: "Caldereta", Claimed: 2200, Unclaimed: 300 },
                { dayOfWeek: "Week 4", dish1: "Tilapia", dish2: "Pinakbet", Claimed: 1800, Unclaimed: 600 },
            ]
        },
        {
            trendsData: [
                { dataSpan: "Week 1", "Pre-packed Food": 500, "Customized Order": 100, "Unused vouchers": 50 },
                { dataSpan: "Week 2", "Pre-packed Food": 700, "Customized Order": 150, "Unused vouchers": 70 },
                { dataSpan: "Week 3", "Pre-packed Food": 600, "Customized Order": 120, "Unused vouchers": 60 },
                { dataSpan: "Week 4", "Pre-packed Food": 800, "Customized Order": 180, "Unused vouchers": 80 },
            ]
        },
        {
            TADMCdata: [
                { Day: 'Week 1', AcceptableRange: [58, 62], TADMC: 59.00 },
                { Day: 'Week 2', AcceptableRange: [58, 62], TADMC: 60.00 },
                { Day: 'Week 3', AcceptableRange: [58, 62], TADMC: 61.50 },
                { Day: 'Week 4', AcceptableRange: [58, 62], TADMC: 58.50 },
            ]
        },
        {
            CURdata: [
                { Day: 'Week 1', AcceptableRange: [90, 100], TADMC: 95.00 },
                { Day: 'Week 2', AcceptableRange: [90, 100], TADMC: 97.00 },
                { Day: 'Week 3', AcceptableRange: [90, 100], TADMC: 93.00 },
                { Day: 'Week 4', AcceptableRange: [90, 100], TADMC: 98.00 },
            ]
        },
        {
            OCFdata: [
                { Day: 'Week 1', AcceptableRange: [0, 15], TADMC: 10.00 },
                { Day: 'Week 2', AcceptableRange: [0, 15], TADMC: 8.00 },
                { Day: 'Week 3', AcceptableRange: [0, 15], TADMC: 12.00 },
                { Day: 'Week 4', AcceptableRange: [0, 15], TADMC: 6.00 },
            ]
        }
    ],

    // 3. DATA FOR TAB 3 (MONTHLY)
    monthly: [
        {
            barChartData: [
                { dayOfWeek: "Month 1", dish1: "Chicken Curry", dish2: "Bistek", Claimed: 8000, Unclaimed: 2000 },
                { dayOfWeek: "Month 2", dish1: "Sinigang na Hipon", dish2: "Kare-Kare", Claimed: 7500, Unclaimed: 2500 },
                { dayOfWeek: "Month 3", dish1: "Lechon Kawali", dish2: "Dinuguan", Claimed: 9000, Unclaimed: 1000 },
                { dayOfWeek: "Month 4", dish1: "Pancit Canton", dish2: "Lumpia", Claimed: 8200, Unclaimed: 1800 },
            ]
        },
        {
            trendsData: [
                { dataSpan: "Month 1", "Pre-packed Food": 2000, "Customized Order": 500, "Unused vouchers": 200 },
                { dataSpan: "Month 2", "Pre-packed Food": 2200, "Customized Order": 600, "Unused vouchers": 150 },
                { dataSpan: "Month 3", "Pre-packed Food": 2500, "Customized Order": 700, "Unused vouchers": 100 },
                { dataSpan: "Month 4", "Pre-packed Food": 2300, "Customized Order": 650, "Unused vouchers": 180 },
            ]
        },
        {
            TADMCdata: [
                { Day: 'Month 1', AcceptableRange: [58, 62], TADMC: 60.00 },
                { Day: 'Month 2', AcceptableRange: [58, 62], TADMC: 59.50 },
                { Day: 'Month 3', AcceptableRange: [58, 62], TADMC: 61.00 },
                { Day: 'Month 4', AcceptableRange: [58, 62], TADMC: 60.20 },
            ]
        },
        {
            CURdata: [
                { Day: 'Month 1', AcceptableRange: [90, 100], TADMC: 96.00 },
                { Day: 'Month 2', AcceptableRange: [90, 100], TADMC: 95.50 },
                { Day: 'Month 3', AcceptableRange: [90, 100], TADMC: 97.00 },
                { Day: 'Month 4', AcceptableRange: [90, 100], TADMC: 96.50 },
            ]
        },
        {
            OCFdata: [
                { Day: 'Month 1', AcceptableRange: [0, 15], TADMC: 9.00 },
                { Day: 'Month 2', AcceptableRange: [0, 15], TADMC: 11.00 },
                { Day: 'Month 3', AcceptableRange: [0, 15], TADMC: 8.00 },
                { Day: 'Month 4', AcceptableRange: [0, 15], TADMC: 10.00 },
            ]
        }
    ],

    // 4. DATA FOR TAB 4 (OVERALL)
    overall: {
        mostMealClaims: [
            { title: "Third Most Meal Combination", value: "Hatdog / Longganisa", subtitle: "28.31% of total | 2,123 claims" },
            { title: "Second Most Meal Combination", value: "Adobo / Menudo", subtitle: "31.01% of total | 2,325 claims" },
            { title: "Most Claimed Combination", value: "Chicken Curry / Burger Steak", subtitle: "33.72% of total | 2,529 claims" },
        ],
        leastMealClaims: [
            { title: "Third Least Claimed Combination", value: "Miswa / Sotanghon", subtitle: "3.30% of total | 247 claims" },
            { title: "Second Least Claimed Combination", value: "Monggo / Fried Fish", subtitle: "2.90% of total | 217 claims" },
            { title: "Least Claimed Combination", value: "Ampalaya / Itlog", subtitle: "2.47% of total | 185 claims" },
        ],
        claimsCount: [
            { title: "Overall Unclaimed Count", value: 10, inPercentage: true, subtitle: "1000 claims" },
            { title: "Overall Food Item Claim Count", value: 40, inPercentage: true, subtitle: "6000 claims" },
            { title: "Overall Free Meal Claim Count", value: 50, inPercentage: true, subtitle: "7500 claims" },
            { title: "Overall Claim Count", value: 15000, subtitle: "Free Meal + Food Item Claim" },
        ],
        KPIreports: [
            { title: "Average OCF", value: 10.00, isPercentage: true, subtitle: "Overall" },
            { title: "Average CUR", value: 95.00, isPercentage: true, subtitle: "Overall" },
            { title: "Average TADMC", value: 60.00, subtitle: "Overall" },
        ],
        consumedCredits: [
            { title: "Total Unused Credits", value: "₱2,340", subtitle: "The actual unused credits" },
            { title: "Total Consumed Credits", value: "₱150,000", subtitle: "The actual consumed credits" },
        ]
    }
};

export const MOCK_EVENTS = [
    [
        { link: "#", color: "#dbeafe", title: "Teachers' Day", date: "Oct 5, 2025" },
        { link: "#", color: "#fee2e2", title: "President' Day", date: "Nov 25, 2025" },
        { link: "#", color: "#ffedd5", title: "College Intramurals", date: "Dec 15, 2025" },
        { link: "#", color: "#f3e8ff", title: "LVCC 27th Foundation Day", date: "Febuary 2026" }
    ],
    [
        { link: "#", color: "#f3e8ff", title: "CL Week", date: "Jan 25 - 31, 2026" }
    ]
];