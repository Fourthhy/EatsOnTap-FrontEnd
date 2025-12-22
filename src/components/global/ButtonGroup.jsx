import React, { useState, useRef, useEffect } from 'react';

// BUTTON ITEM DOCUMENTATION (Icon removed from ButtonItem definition)
/**
 * @typedef {object} ButtonItem
 * @property {string} label - The text label for the button.
 * @property {string | number} id - A unique identifier for the button.
 */

/**
 * @typedef {object} ButtonGroupItemProps
 * @property {ButtonItem} buttonData - The data object for the button (label, id).
 * @property {string | number} activeId - The ID of the currently active button.
 * @property {(id: string | number) => void} onClick - Handler for button clicks.
 * @property {string} [activeTextColor='white'] - The text color for the active state.
 * @property {React.RefObject<HTMLButtonElement>} buttonRef - A ref to attach to the button element.
 */

/**
 * A standardized component for an individual button within the ButtonGroup (now without an icon).
 * @param {ButtonGroupItemProps} props
 */
const ButtonGroupItem = ({
  buttonData,
  activeId,
  onClick,
  activeTextColor = 'white',
  buttonRef
}) => {
  const isActive = buttonData.id === activeId;

  // Base style for the button, fully converted to inline style
  const baseStyle = {
    padding: '0.5rem 1rem', // px-4 py-2
    borderRadius: 6, // rounded-md
    fontSize: 12, // text-sm
    fontWeight: 400, // font-medium
    fontFamily: 'geist',
    whiteSpace: 'nowrap', // whitespace-nowrap
    display: 'flex', // flex
    alignItems: 'center', // items-center
    gap: '0rem', // gap: 0rem (no icon, so no gap needed)
    // Crucial: Set position relative so the button is layered above the absolute indicator
    position: 'relative',
    zIndex: 2, // Layered above the indicator (zIndex 1)
    backgroundColor: 'transparent', // Always transparent, indicator provides the color
    // Only the color of the text/icon changes here
    transitionProperty: 'color', // transition-colors (only for color now)
    transitionDuration: '150ms',
  };

  // Dynamic inline styles based on active state (only controls text color)
  const dynamicStyle = {
    color: isActive ? activeTextColor : '#727c89ff', // gray-600 equivalent when inactive
    boxShadow: isActive? "0 2px 6px #e5eaf0ac" : "", 
    border: isActive ? "1px solid #ddddddaf" : ""
};

// We keep Tailwind classes ONLY for hover state
const tailwindClasses = `transition-colors ${isActive ? '' : 'hover:bg-gray-200 color-[#231F20]'}`;

// Merge base and dynamic inline styles
const mergedStyle = {
  ...baseStyle, ...dynamicStyle
};

// Icon related logic has been completely removed.

return (
  <button
    ref={buttonRef} // Attach the ref here
    onClick={() => onClick(buttonData.id)}
    className={tailwindClasses}
    style={mergedStyle}
  >
    {/* Label */}
    <span className={isActive ? "" : "hover:text-[#231F20] cursor-pointer"}>
      {buttonData.label}
    </span>
  </button>
);
};

// BUTTON GROUP DOCUMENTATION (Icon removed from ButtonGroupProps definition)

/**
 * @typedef {object} ButtonGroupProps
 * @property {Array<{ label: string, id: string | number }>} buttonListGroup - The array of button configuration objects.
 * @property {string | number} [initialActiveId] - The ID of the button that should be active initially. Defaults to the first item's ID.
 * @property {(id: string | number) => void} [onSetActiveId] - Optional callback when a button is clicked, providing the new active ID.
 * @property {string} [activeColor='#1F3460'] - The background color for the active button.
 */

/**
 * A dynamic button group component that manages the active state internally.
 * @param {ButtonGroupProps} props
 */

const ButtonGroup = ({
  buttonListGroup,
  initialActiveId,
  onSetActiveId,
  activeColor = '#2CA4DD3f', // Blue from your example
}) => {
  const defaultInitialId = buttonListGroup.length > 0 ? buttonListGroup[0].id : null;
  const [activeId, setActiveId] = useState(initialActiveId ?? defaultInitialId);

  // Ref for the entire button group container
  const containerRef = useRef(null);
  // Ref to store the mapping of button IDs to their respective element refs
  const buttonRefs = useRef({});

  // State to track the position and size of the sliding indicator
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0
  });

  // Effect to calculate and update the indicator position when activeId changes
  useEffect(() => {
    // 1. Get the container element for relative positioning calculations
    const containerEl = containerRef.current;
    if (!containerEl) return;

    // 2. Get the currently active button element. 
    const activeButtonRefObject = buttonRefs.current[activeId];
    // Check if the ref object exists and has the DOM element attached to its .current property
    const activeButtonEl = activeButtonRefObject?.current;

    if (!activeButtonEl) return;

    // 3. Get the bounding rectangles
    const containerRect = containerEl.getBoundingClientRect();
    const activeRect = activeButtonEl.getBoundingClientRect();

    // 4. Calculate the relative position (offset from container's left edge)
    const newLeft = activeRect.left - containerRect.left;
    const newWidth = activeRect.width;

    // 5. Update the indicator style
    setIndicatorStyle({
      left: newLeft,
      width: newWidth,
      opacity: 1, // Make it visible once calculated
    });

  }, [activeId, buttonListGroup.length]); // Recalculate on ID change or button list change


  const handleButtonClick = (id) => {
    setActiveId(id);
    if (onSetActiveId) {
      onSetActiveId(id);
    }
  };

  if (!buttonListGroup || buttonListGroup.length === 0) {
    return null;
  }

  // The main container style, converted to inline style
  const containerStyle = {
    display: 'flex', // flex
    backgroundColor: '#f3f4f6', // bg-gray-100
    borderRadius: '0.5rem', // rounded-lg
    padding: '0.25rem', // p-1
    gap: '0.25rem', // replacing space-x-1
    position: 'relative', // **Crucial for absolute positioning of the indicator**
  };

  // Style for the sliding indicator element
  const indicatorBaseStyle = {
    position: 'absolute',
    top: '0.25rem', // Matches the container's p-1 (0.25rem)
    height: 'calc(100% - 0.5rem)', // 100% minus top and bottom padding (2 * 0.25rem = 0.5rem)
    backgroundColor: activeColor,
    borderRadius: '0.375rem', // rounded-md, matches button
    zIndex: 1, // Positioned below the buttons (zIndex 2)
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)', // Smooth slide animation (ease-in-out)
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-sm, matches original active button style
    // Apply dynamic position/size via transform for better performance
    transform: `translateX(${indicatorStyle.left}px)`,
    width: `${indicatorStyle.width}px`,
    opacity: indicatorStyle.opacity,
    left: 1
  };


  return (
    <div ref={containerRef} style={containerStyle}>
      {/* 1. The Sliding Indicator (Renders first so it sits under the buttons) */}
      <div style={indicatorBaseStyle} />

      {/* 2. The Buttons (Renders next so they sit on top of the indicator) */}
      {buttonListGroup.map((button) => {
        // Create a ref for each button and store it in the buttonRefs map
        if (!buttonRefs.current[button.id]) {
          buttonRefs.current[button.id] = React.createRef();
        }

        return (
          <ButtonGroupItem
            key={button.id}
            buttonRef={buttonRefs.current[button.id]} // Pass the ref object to the item
            buttonData={button}
            activeId={activeId}
            onClick={handleButtonClick}
            activeTextColor="#231F20" // Explicitly set the active text color
          />
        );
      })}
    </div>
  );
};

export { ButtonGroup };