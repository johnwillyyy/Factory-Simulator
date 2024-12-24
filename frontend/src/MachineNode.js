import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import Machine from './machine';

const MachineNode = ({ data }) => {
    return (
        <div>
            <Handle type="target" position={Position.Top} style={{ borderRadius: 6 }} />
            <Machine id={data.id} initialPosition={{ x: 0, y: 0 }} />
            <Handle type="source" position={Position.Bottom} style={{ borderRadius: 6 }} />
        </div>
    );
};

export default MachineNode