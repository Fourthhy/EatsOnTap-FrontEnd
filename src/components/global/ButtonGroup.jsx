import React, { useState, useRef, useEffect } from 'react';

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
    zIndex: 2, 
    backgroundColor: 'transparent',
    transition: 'all 200ms ease',
    cursor: 'pointer',
    outline: 'none',
    border: 'none'
  };

  const dynamicStyle = {
    color: isActive ? activeTextColor : '#727c89ff',
    // We add a subtle border only to the active button to match your design
    boxShadow: isActive ? "0 2px 6px #e5eaf0ac" : "none",
    border: isActive ? "1px solid #ddddddaf" : "1px solid transparent",
  };

  const tailwindClasses = `transition-all duration-200 ${
    isActive ? '' : 'hover:bg-gray-200 hover:text-[#231F20]'
  }`;

  return (
    <button
      ref={buttonRef}
      // Logic Fix: Pass the ID directly
      onClick={() => onClick(buttonData.id)}
      className={tailwindClasses}
      style={{ ...baseStyle, ...dynamicStyle }}
    >
      <span style={{ pointerEvents: 'none' }}>
        {buttonData.label}
      </span>
    </button>
  );
};

const ButtonGroup = ({
  buttonListGroup,
  initialActiveId,
  onSetActiveId,
  activeColor = '#4268BD',
}) => {
  // Use a ref to track if it's the first render
  const isFirstRender = useRef(true);
  const [activeId, setActiveId] = useState(initialActiveId || buttonListGroup[0]?.id);
  const containerRef = useRef(null);
  const buttonRefs = useRef({});

  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0
  });

  // Sync internal state with external prop
  useEffect(() => {
    if (initialActiveId !== undefined) {
      setActiveId(initialActiveId);
    }
  }, [initialActiveId]);

  // Measurement Logic
  useEffect(() => {
    const updateIndicator = () => {
      const activeButtonEl = buttonRefs.current[activeId];
      if (activeButtonEl) {
        setIndicatorStyle({
          left: activeButtonEl.offsetLeft,
          width: activeButtonEl.offsetWidth,
          opacity: 1,
        });
      }
    };

    // Use a tiny timeout to ensure the browser has calculated widths
    const timer = setTimeout(updateIndicator, 0);
    return () => clearTimeout(timer);
  }, [activeId, buttonListGroup]);

  const handleButtonClick = (id) => {
    setActiveId(id);
    // Logic Fix: Always notify parent, even if it's already active
    if (onSetActiveId) {
      onSetActiveId(id);
    }
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
    zIndex: 1,
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: `translateX(${indicatorStyle.left}px)`,
    width: `${indicatorStyle.width}px`,
    opacity: indicatorStyle.opacity,
    left: 0,
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      <div style={indicatorBaseStyle} />
      {buttonListGroup.map((button) => (
        <ButtonGroupItem
          key={button.id}
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