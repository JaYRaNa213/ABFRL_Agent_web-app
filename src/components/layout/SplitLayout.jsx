import React, { useState, useEffect, useRef } from 'react';

const SplitLayout = ({ leftChild, rightChild, initialSplit = 75 }) => {
    const [splitPosition, setSplitPosition] = useState(initialSplit); // Percentage
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        e.preventDefault(); // Prevent text selection
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const newSplit = ((e.clientX - containerRect.left) / containerRect.width) * 100;

        // Constraint the split between 20% and 80%
        if (newSplit > 20 && newSplit < 80) {
            setSplitPosition(newSplit);
        }
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            className="split-layout-container"
            style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}
        >
            {/* Left Panel: E-commerce Website */}
            <div
                className="left-panel"
                style={{ width: `${splitPosition}%`, overflowY: 'auto', position: 'relative' }}
            >
                {leftChild}
            </div>

            {/* Draggable Divider */}
            <div
                className="resizer"
                onMouseDown={handleMouseDown}
                style={{
                    width: '6px',
                    background: isDragging ? '#FFE600' : 'rgba(255, 255, 255, 0.1)',
                    cursor: 'col-resize',
                    transition: 'background 0.2s',
                    zIndex: 10 // Ensure it's above other content
                }}
            />

            {/* Right Panel: Agent Interface */}
            <div
                className="right-panel"
                style={{ width: `${100 - splitPosition}%`, overflowY: 'auto', background: '#1e1e1e' }}
            >
                {rightChild}
            </div>
        </div>
    );
};

export default SplitLayout;
