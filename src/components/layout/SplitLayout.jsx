import React, { useState, useEffect, useRef } from 'react';
import { IconButton, Box } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

const SplitLayout = ({ leftChild, rightChild, initialSplit = 75 }) => {
    const [splitPosition, setSplitPosition] = useState(initialSplit);
    const [isDragging, setIsDragging] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isAgentPanelOpen, setIsAgentPanelOpen] = useState(false);
    const containerRef = useRef(null);

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleMouseDown = (e) => {
        if (isMobile) return; // Disable dragging on mobile
        setIsDragging(true);
        e.preventDefault();
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current || isMobile) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const newSplit = ((e.clientX - containerRect.left) / containerRect.width) * 100;

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

    // Mobile Layout
    if (isMobile) {
        return (
            <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
                {/* Main Shop Content */}
                <div style={{ height: '100%', overflowY: 'auto' }}>
                    {leftChild}
                </div>

                {/* Floating Agent Toggle Button */}
                {!isAgentPanelOpen && (
                    <IconButton
                        onClick={() => setIsAgentPanelOpen(true)}
                        sx={{
                            position: 'fixed',
                            bottom: 20,
                            right: 20,
                            bgcolor: 'var(--accent-gold)',
                            color: 'black',
                            width: 60,
                            height: 60,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            '&:hover': {
                                bgcolor: 'var(--accent-gold)',
                                transform: 'scale(1.1)',
                            },
                            transition: 'all 0.3s',
                            zIndex: 1000,
                        }}
                    >
                        <ChatIcon fontSize="large" />
                    </IconButton>
                )}

                {/* Agent Panel Drawer (slides up from bottom) */}
                {isAgentPanelOpen && (
                    <Box
                        sx={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '85vh',
                            bgcolor: '#1e1e1e',
                            zIndex: 1001,
                            boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
                            transform: isAgentPanelOpen ? 'translateY(0)' : 'translateY(100%)',
                            transition: 'transform 0.3s ease-in-out',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* Close Button */}
                        <IconButton
                            onClick={() => setIsAgentPanelOpen(false)}
                            sx={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                color: 'var(--accent-gold)',
                                zIndex: 1002,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        {/* Agent Panel Content */}
                        <div style={{ height: '100%', overflow: 'hidden' }}>
                            {rightChild}
                        </div>
                    </Box>
                )}
            </div>
        );
    }

    // Desktop Layout (existing split-screen)
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
                    zIndex: 10
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
