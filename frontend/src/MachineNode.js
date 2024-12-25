import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

const Machine = ({ data }) => {
  return (
    <div >
      <Handle
        type="target"
        position={Position.Left} // Correctly set to Position.Left
        style={{ background: 'black'}}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
            <h1>lol</h1>
            <h1>lol</h1>

      <Handle
        type="source"
        position={Position.Right} // Correctly set to Position.Left
        style={{ background: 'black' }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
    </div>
  );
};

export default Machine;
