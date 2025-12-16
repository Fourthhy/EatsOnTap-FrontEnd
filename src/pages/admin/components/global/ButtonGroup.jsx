import React, { useState } from 'react';

// BUTTON ITEM DOCUMENTATION (Unchanged)
/**
 * @typedef {object} ButtonItem
 * @property {string | React.ReactNode} icon - The icon component or element.
 * @property {string} label - The text label for the button.
 * @property {string | number} id - A unique identifier for the button.
 */

/**
 * @typedef {object} ButtonGroupItemProps
 * @property {ButtonItem} buttonData - The data object for the button (icon, label, id).
 * @property {string | number} activeId - The ID of the currently active button.
 * @property {(id: string | number) => void} onClick - Handler for button clicks.
 * @property {string} activeColor - The color to use for the active state background.
 * @property {string} [activeTextColor='white'] - The text color for the active state.
 */

/**
 * A standardized component for an individual button within the ButtonGroup.
 * The icon is now preserved regardless of active state, with its color adjusted.
 * @param {ButtonGroupItemProps} props
 */
const ButtonGroupItem = ({
  buttonData,
  activeId,
  onClick,
  activeColor,
  activeTextColor = 'white'
}) => {
  const isActive = buttonData.id === activeId;
  
  // Base style for the button, fully converted to inline style
  const baseStyle = {
    padding: '0.5rem 1rem', // px-4 py-2
    borderRadius: '0.375rem', // rounded-md
    fontSize: '0.875rem', // text-sm
    fontWeight: 500, // font-medium
    whiteSpace: 'nowrap', // whitespace-nowrap
    display: 'flex', // flex
    alignItems: 'center', // items-center
    gap: '0.5rem', // gap-2
    transitionProperty: 'color, background-color, box-shadow', // transition-colors
    transitionDuration: '150ms', 
  };
    
  // Dynamic inline styles based on active state
  const dynamicStyle = {
    backgroundColor: isActive ? activeColor : 'transparent',
    color: isActive ? activeTextColor : '#4b5563', // gray-600 equivalent when inactive
    boxShadow: isActive ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none', // shadow-sm
  };
    
  // We keep Tailwind classes ONLY for hover state
  const tailwindClasses = `transition-colors ${isActive ? '' : 'hover:bg-gray-200 text-gray-600'}`;

  // Merge base and dynamic inline styles
  const mergedStyle = { ...baseStyle, ...dynamicStyle };

  // Determine the color for the icon element
  const iconColor = isActive ? 'white' : '#4b5563'; // White when active, gray when inactive
  const iconSize = 16;
  
  // Logic to render the icon:
  let iconElement = null;
  if (buttonData.icon && React.isValidElement(buttonData.icon)) {
      // If the icon is a valid React element (like a Lucide icon), clone it
      // to inject the dynamic color and size props.
      iconElement = React.cloneElement(buttonData.icon, { 
          size: iconSize, 
          color: iconColor 
      });
  }

  return (
    <button
      onClick={() => onClick(buttonData.id)}
      className={tailwindClasses}
      style={mergedStyle}
    >
      {/* Icon Rendering (Directly rendered, no wrapper dot) */}
      {iconElement}
      
      {/* Label */}
      {buttonData.label}
    </button>
  );
};

// BUTTON GROUP DOCUMENTATION (Unchanged)

/**
 * @typedef {object} ButtonGroupProps
 * @property {Array<{ icon: React.ReactNode, label: string, id: string | number }>} buttonListGroup - The array of button configuration objects.
 * @property {string | number} [initialActiveId] - The ID of the button that should be active initially. Defaults to the first item's ID.
 * @property {(id: string | number) => void} [onSetActiveId] - Optional callback when a button is clicked, providing the new active ID.
 * @property {string} [activeColor='#4268BD'] - The background color for the active button.
 */

/**
 * A dynamic button group component that manages the active state internally.
 * @param {ButtonGroupProps} props
 */

const ButtonGroup = ({
  buttonListGroup,
  initialActiveId,
  onSetActiveId,
  activeColor = '#4268BD', // Blue from your example
}) => {
  const defaultInitialId = buttonListGroup.length > 0 ? buttonListGroup[0].id : null;
  const [activeId, setActiveId] = useState(initialActiveId ?? defaultInitialId);
  
  const handleButtonClick = (id) => {
    setActiveId(id);
    if (onSetActiveId) {
      onSetActiveId(id);
    }
  };

  if (!buttonListGroup || buttonListGroup.length === 0) {
    return null;
  }

  // The main container style, fully converted to inline style
  const containerStyle = {
    display: 'flex', // flex
    backgroundColor: '#f3f4f6', // bg-gray-100
    borderRadius: '0.5rem', // rounded-lg
    padding: '0.25rem', // p-1
    gap: '0.25rem', // replacing space-x-1
  };

  return (
    <div style={containerStyle}>
      {buttonListGroup.map((button) => (
        <ButtonGroupItem
          key={button.id}
          buttonData={button}
          activeId={activeId}
          onClick={handleButtonClick}
          activeColor={activeColor}
          activeTextColor="white" // Explicitly set the active text color
        />
      ))}
    </div>
  );
};

export { ButtonGroup };