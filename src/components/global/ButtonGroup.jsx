import React, { useState, useRef, useEffect } from 'react';

/**
 * Standardized component for an individual button within the ButtonGroup.
 */
const ButtonGroupItem = ({
  buttonData,
  activeId,
  onClick,
  activeTextColor = 'white',
  buttonRef
}) => {
  const isActive = buttonData.id === activeId;

  const baseStyle = {
    padding: '0.5rem 1rem',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 400,
    fontFamily: 'geist',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'transparent',
    transition: 'all 200ms ease',
    cursor: 'pointer',
    outline: 'none',
    border: '2px solid red',
    zIndex: 1000, // Layered above the indicator
  };

  const dynamicStyle = {
    color: isActive ? activeTextColor : '#727c89ff',
    boxShadow: isActive ? "0 2px 6px #e5eaf0ac" : "none",
    border: `1px solid ${isActive ? '#ddddddaf' : 'transparent'}`,
  };

  const tailwindClasses = `transition-all duration-200 ${isActive ? '' : 'hover:bg-gray-200 hover:text-[#000000cc]'
    }`;

  return (
    <button
      ref={buttonRef}
      // Trigger click even if already active to ensure parent logic resets
      onClick={() => onClick(buttonData.id)}
      className={tailwindClasses}
      style={{ ...baseStyle, ...dynamicStyle }}
    >
      {/* pointer-events-none ensures the button, not the text, captures the click */}
      <span style={{ pointerEvents: 'none' }}>
        {buttonData.label}
      </span>
    </button>
  );
};

/**
 * A dynamic button group component with a sliding indicator.
 */
const ButtonGroup = ({
  buttonListGroup,
  activeId,
  onSetActiveId,
  activeColor = '#4268BD',
}) => {
  const containerRef = useRef(null);
  const buttonRefs = useRef({});

  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0
  });

  // Handle measurement of the active button
  useEffect(() => {
    const updateIndicator = () => {
      const containerEl = containerRef.current;
      const activeButtonEl = buttonRefs.current[activeId];

      if (containerEl && activeButtonEl) {
        setIndicatorStyle({
          left: activeButtonEl.offsetLeft,
          width: activeButtonEl.offsetWidth,
          opacity: 1,
        });
      }
    };

    // Use a zero-delay timeout to ensure DOM layout is complete before measuring
    const timer = setTimeout(updateIndicator, 0);
    return () => clearTimeout(timer);
  }, [activeId, buttonListGroup]);

  const handleButtonClick = (id) => {
    onSetActiveId?.(id);
  };

  const containerStyle = {
    display: 'flex',
    backgroundColor: '#f3f4f6',
    borderRadius: '0.5rem',
    padding: '0.25rem',
    gap: '0.25rem',
    position: 'relative',
    width: 'fit-content',
  };

  const indicatorBaseStyle = {
    position: 'absolute',
    top: '0.25rem',
    height: 'calc(100% - 0.5rem)',
    backgroundColor: activeColor,
    borderRadius: '0.375rem',
    pointerEvents: 'none',
    transition: 'left 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    left: indicatorStyle.left,
    width: indicatorStyle.width,
    opacity: indicatorStyle.opacity,
    zIndex: 0,
  };



  if (!buttonListGroup || buttonListGroup.length === 0) return null;

  return (
    <div ref={containerRef} style={containerStyle}>
      <div style={indicatorBaseStyle} />

      {buttonListGroup.map((button) => (
        <ButtonGroupItem
          key={button.id}
          // Callback ref captures the DOM element for precise measurement
          buttonRef={(el) => (buttonRefs.current[button.id] = el)}
          buttonData={button}
          activeId={activeId}
          onClick={handleButtonClick}
          activeTextColor="#EEEEEE"
        />
      ))}
    </div>
  );
};

export { ButtonGroup };