import React, { useState, createContext, useContext } from 'react';

const DateContext = createContext();

export function DateProvider({ children }) {
    const [selectedDate, setSelectedDate] = useState('');

    const handleChange = (e) => {
        setSelectedDate(e.target.value);
    };

    return (
        <DateContext.Provider value={{ selectedDate, handleChange }}>
            {children}
        </DateContext.Provider>
    );
}
export function useDate() {
    return useContext(DateContext);
}
function DatePicker() {
    const { selectedDate, handleChange } = useDate();

    return (
        <>
            <div className="w-full h-auto flex items-center justify-end gap-5" style={{ marginTop: 5 }}>
                <span style={{ fontWeight: "450", fontSize: 14, color: "#000000", fontFamily: "geist", width: "fit-content", height: "fit-content" }}>
                    {selectedDate ? "Displaying reports for" : "Select Date"}
                </span>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleChange}
                    style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 5,
                        paddingBottom: 5,
                        marginRight: 20
                    }}
                    className="font-geist text-12 font-normal border border-[#D9D9D9] rounded outline-none focus:border-gray-400 transition-colors"
                />
            </div>
        </>
    );
};

export { DatePicker };