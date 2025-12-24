import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Sub-component: Handles the specific "Swipe Entry" animation.
 * When 'isActive' becomes true, the background div expands from width 0% to 100%.
 */
const AnimatedPageButton = ({ page, isActive, onClick }) => {
  const [animState, setAnimState] = useState({ width: '0%', opacity: 0 });

  useEffect(() => {
    if (isActive) {
      // 1. Reset briefly (optional, but ensures replayability if needed)
      setAnimState({ width: '0%', opacity: 0 });
      
      // 2. Trigger the slide-in animation
      const timer = setTimeout(() => {
        setAnimState({ width: '100%', opacity: 1 });
      }, 10);
      
      return () => clearTimeout(timer);
    } else {
      // Reset state if not active
      setAnimState({ width: '0%', opacity: 0 });
    }
  }, [isActive]);

  const baseStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    boxShadow: isActive ? "0 2px 6px #e5eaf0ac" : "none",
    border: `1px solid ${isActive ? '#ddddddaf' : 'transparent'}`,
    position: 'relative',
    overflow: 'hidden', // Keeps the swipe inside the rounded corners
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'color 200ms ease',
    backgroundColor: isActive ? 'transparent' : 'transparent', // Let background div handle color
  };

  return (
    <button
      onClick={() => onClick(page)}
      className={`${isActive ? 'text-[#EEEEEE]' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'}`}
      style={baseStyle}
    >
      {/* The Swipe Background Layer */}
      {isActive && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            backgroundColor: '#4268BD',
            zIndex: 0,
            // The Animation Props
            width: animState.width,
            opacity: animState.opacity,
            transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease',
          }}
        />
      )}

      {/* The Page Number (Layered on top) */}
      <span style={{ position: 'relative', zIndex: 10 }}>
        {page}
      </span>
    </button>
  );
};

/**
 * Main Component
 */
const TablePagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {

  // Helper to calculate visible pages (with simple "..." logic)
  const getVisiblePages = () => {
    const pages = [];
    if (totalPages <= 7) {
      // Show all if few pages
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first, last, and window around current
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5);
      } else if (currentPage >= totalPages - 3) {
        pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div 
      className="p-4 border-t border-gray-100 flex items-center justify-center gap-2 shrink-0 bg-white"
      style={{ 
        padding: '16px', 
        borderTop: '1px solid #f3f4f6', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '8px' 
      }}
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ padding: '8px 12px', borderRadius: '6px' }}
      >
        <ChevronLeft size={16} /> Previous
      </button>

      {/* First Page (if gap exists) */}
      {totalPages > 7 && visiblePages[0] > 1 && (
        <>
          <AnimatedPageButton page={1} isActive={currentPage === 1} onClick={onPageChange} />
          <span className="text-gray-400">...</span>
        </>
      )}

      {/* Visible Numbered Buttons */}
      {visiblePages.map((page) => (
        <AnimatedPageButton
          key={page}
          page={page}
          isActive={currentPage === page}
          onClick={onPageChange}
        />
      ))}

      {/* Last Page (if gap exists) */}
      {totalPages > 7 && visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          <span className="text-gray-400">...</span>
          <AnimatedPageButton page={totalPages} isActive={currentPage === totalPages} onClick={onPageChange} />
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ padding: '8px 12px', borderRadius: '6px' }}
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
};

export { TablePagination };