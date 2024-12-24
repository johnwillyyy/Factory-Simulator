import React, { useState } from 'react';
import { useDraggable } from './dragUtils';

const Machine = ({ id, initialPosition }) => {
    const [position, setPosition] = useState(initialPosition);

    const { dragStart, dragEnd } = useDraggable(setPosition);

    return (
        <div
            draggable="true"
            onDragStart={(e) => dragStart(e, position)}
            onDragEnd={dragEnd}
            style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: '100px',
                height: '30px',
                borderRadius: '20%',
                backgroundColor: 'yellow',
                color: 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'move',
                userSelect: 'none',
            }}
        >
            Machine {id}
        </div>
    );
};

export default Machine;
