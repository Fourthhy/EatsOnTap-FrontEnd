import { StudentList } from "../src/components/global/table/SampleStudentList";


import React from 'react';

const StickyLayout = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '70% 30%', alignItems: 'start' }}>
      
      {/* 70% Scrollable Column */}
      <div style={{ padding: '20px' }}>
        <h2>Main Content</h2>
        {/* Imagine lots of content here that makes the page long */}
        <div style={{ height: '2000px', background: '#f0f0f0' }}>
          The user scrolls down through this...
        </div>
      </div>

      {/* 30% Sticky Column */}
      <aside style={{
        position: 'sticky',
        top: '20px', // This is the gap from the top of the screen
        padding: '20px',
        background: '#e0e0e0',
        height: 'fit-content' // Crucial: prevents the div from stretching to match the 70% column
      }}>
        <h3>Sticky Sidebar</h3>
        <p>I will stay put while you scroll!</p>
      </aside>
      
    </div>
  );
};

function Playground() {
    return (
        <>
            <StudentList />
        </>
    );
}

export default Playground;