// --- MOCK DATA GENERATOR ---
export const generateMockRequests = () => {
    const senders = ["Ms. Maria Santos", "Mr. Rudy Iba", "Ms. Sophie Sarcia", "Mr. Lorence Tagailog", "Event Organizer A", "Event Organizer B"];

    const basicEdSections = ["Kinder-Love", "Grade 1-Faith", "Grade 4-Hope", "Grade 7-Rizal", "Grade 10-Bonifacio", "Grade 11-STEM", "Grade 12-ABM"];
    const higherEdSections = ["BSIT 1-A", "BSCS 2-B", "AB Broadcasting 3-A", "BSSW 4-C", "Associate CT 1-A"];
    const eventSections = ["Sports Fest", "Seminary Night", "Teachers Conference", "Foundation Day"];

    return Array.from({ length: 50 }).map((_, index) => {
        const isEvent = Math.random() > 0.8;

        let section = "";
        let category = "";

        if (isEvent) {
            section = eventSections[Math.floor(Math.random() * eventSections.length)];
            category = "Event";
        } else {
            const isBasic = Math.random() > 0.4;
            if (isBasic) {
                section = basicEdSections[Math.floor(Math.random() * basicEdSections.length)];
                category = "Basic Education";
            } else {
                section = higherEdSections[Math.floor(Math.random() * higherEdSections.length)];
                category = "Higher Education";
            }
        }

        return {
            id: index + 1,
            sectionProgram: section,
            sender: senders[index % senders.length],
            recipientCount: Math.floor(Math.random() * 40) + 30,
            waivedCount: Math.floor(Math.random() * 5),
            timeSent: "7:10 AM",
            type: isEvent ? 'Event' : 'Regular',
            category: category,
            status: index % 4 === 0 ? "Approved" : (index % 7 === 0 ? "Rejected" : "Pending"),
        };
    });
};