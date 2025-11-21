import React, { useState } from 'react';

function DatePicker() {
    const [selectedDate, setSelectedDate] = useState('');

    const handleChange = (e) => {
        setSelectedDate(e.target.value);
    };

    return (
        <input
            type="date"
            value={selectedDate}
            onChange={handleChange}
            className="font-geist text-12 font-normal border border-[#D9D9D9] rounded px-2 py-1 outline-none focus:border-gray-400 transition-colors"
        />
    );
};

export {DatePicker}
