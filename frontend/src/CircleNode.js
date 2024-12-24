import React from 'react';
import { Handle } from 'react-flow-renderer';

const CircleNode = ({ data }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: '#FFCC00', // Yellow color
      color: 'black',
      border: '2px solid #000', // Black border
    }}>
      <Handle
        type="target"
        position="top"
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      {data.label}
      <Handle
        type="source"
        position="bottom"
        style={{ background: 'white' }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
    </div>
  );
};

export default CircleNode;
