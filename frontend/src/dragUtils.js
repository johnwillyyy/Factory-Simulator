import { useState, useRef } from 'react';

// This hook initializes and returns the handlers needed for dragging
export const useDraggable = (updatePositionCallback) => {
    const [isDragging, setDragging] = useState(false);
    const positionRef = useRef({ x: 0, y: 0 });

    const dragStart = (e, position) => {
        setDragging(true);
        positionRef.current = {
            offsetX: e.clientX - position.x,
            offsetY: e.clientY - position.y
        };
        e.dataTransfer.effectAllowed = 'move';
    };

    const dragEnd = (e) => {
        if (isDragging) {
            const newPos = {
                x: e.clientX - positionRef.current.offsetX,
                y: e.clientY - positionRef.current.offsetY
            };
            updatePositionCallback(newPos);
            setDragging(false);
        }
    };

    return { dragStart, dragEnd };
};
