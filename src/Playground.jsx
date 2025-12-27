import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import { Save, AlertTriangle, Power, Clock, Calendar, ShieldAlert, CheckCircle2 } from 'lucide-react';
import SystemSettings from "../src/roles/admin/components/pages/SystemSettings";


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


// --- HELPER COMPONENT: Single Animation Card ---
const AnimationCard = ({ title, description, transitionProps }) => {
  // We use a key to force React to destroy and recreate the component
  // This effectively "resets" the animation when the button is clicked.
  const [key, setKey] = useState(0);

  const replay = () => setKey(prev => prev + 1);

  return (
    <div style={{
      border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px',
      backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 4px 0', color: '#111827' }}>{title}</h3>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{description}</p>
        </div>
        <button
          onClick={replay}
          style={{
            padding: '8px', borderRadius: '6px', border: '1px solid #e5e7eb',
            background: 'white', cursor: 'pointer', color: '#374151',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          title="Replay Animation"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* The Animation Track */}
      <div style={{
        height: '80px', backgroundColor: '#f3f4f6', borderRadius: '8px',
        position: 'relative', display: 'flex', alignItems: 'center', padding: '0 10px',
        overflow: 'hidden'
      }}>
        <motion.div
          key={key} // Changing this resets the element
          initial={{ x: 0, opacity: 0, scale: 0.8 }}
          animate={{ x: 240, opacity: 1, scale: 1 }} // Move 240px to right
          transition={{
            duration: 1.5, // Total time for non-spring animations
            ...transitionProps
          }}
          style={{
            width: '40px', height: '40px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />

        {/* Finish Line Marker (Visual only) */}
        <div style={{
          position: 'absolute', left: '290px', top: '10px', bottom: '10px',
          borderLeft: '2px dashed #d1d5db', zIndex: 0
        }} />
      </div>

      {/* Code Snippet */}
      <div style={{
        backgroundColor: '#1f2937', color: '#a5f3fc', padding: '10px',
        borderRadius: '6px', fontSize: '11px', fontFamily: 'monospace'
      }}>
        transition: {JSON.stringify(transitionProps, null, 1).replace(/\n/g, ' ')}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT: Showcase Grid ---
const FramerShowcase = () => {
  const containerStyle = {
    padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif'
  };

  const gridStyle = {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '48px'
  };

  const sectionHeaderStyle = {
    fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#111827', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px'
  };

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Framer Motion Playground</h1>
        <p style={{ color: '#4b5563' }}>Comparing different physics and bezier curves. Click the refresh icon to replay.</p>
      </div>

      {/* 1. STANDARD EASING (Bezier Curves) */}
      <h2 style={sectionHeaderStyle}>1. Easing Curves (CSS-like)</h2>
      <div style={gridStyle}>
        <AnimationCard
          title="Ease Out"
          description="Starts fast, slows down at the end. Good for entering animations."
          transitionProps={{ ease: "easeOut" }}
        />
        <AnimationCard
          title="Ease In"
          description="Starts slow, speeds up. Good for exiting animations."
          transitionProps={{ ease: "easeIn" }}
        />
        <AnimationCard
          title="Ease In Out"
          description="Slow start, fast middle, slow end."
          transitionProps={{ ease: "easeInOut" }}
        />
        <AnimationCard
          title="Linear"
          description="Constant speed. Robot-like."
          transitionProps={{ ease: "linear" }}
        />
        <AnimationCard
          title="Back Out"
          description="Overshoots the target slightly then settles."
          transitionProps={{ ease: "backOut" }}
        />
        <AnimationCard
          title="Anticipate"
          description="Pulls back slightly before shooting forward."
          transitionProps={{ ease: "anticipate" }}
        />
      </div>

      {/* 2. SPRING PHYSICS (Calculated) */}
      <h2 style={sectionHeaderStyle}>2. Spring Physics</h2>
      <p style={{ marginBottom: '24px', color: '#6b7280' }}>
        Springs don't use duration (usually). They depend on mass, stiffness, and damping.
        They feel more "natural" and "weighty".
      </p>
      <div style={gridStyle}>
        <AnimationCard
          title="Default Spring"
          description="Balanced, natural feel."
          transitionProps={{ type: "spring" }}
        />
        <AnimationCard
          title="Bouncy Spring"
          description="High stiffness, low damping. Very playful."
          transitionProps={{ type: "spring", stiffness: 300, damping: 10 }}
        />
        <AnimationCard
          title="Slow & Stiff"
          description="High stiffness, high damping. Snappy but no bounce."
          transitionProps={{ type: "spring", stiffness: 500, damping: 100 }}
        />
        <AnimationCard
          title="Gentle / Molasses"
          description="Low stiffness. Moves through thick liquid."
          transitionProps={{ type: "spring", stiffness: 50, damping: 20 }}
        />
      </div>
    </div>
  );
};


function Playground() {
  return (
    <>
      <SystemSettings />
    </>
  );
}

export default Playground;