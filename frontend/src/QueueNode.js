import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import styles from './Queue.module.css';  // Import the CSS module

const Queue = ({ data,id }) => {
  return (
    <div className={styles.queueContainer}>
      <p>{id}</p>
      <Handle
        type="source"
        position={Position.Left}
        className={styles.handle}
      />
     <div className={styles.scrollContainer}>
  {data.colors.map((color, index) => (
    <div key={index} className={styles.circle} style={{ backgroundColor: color }}></div>
  ))}
      </div>
      <Handle
        type="target"
        position={Position.Right}
        className={styles.handle}
      />
      <p>{data.colors.length} products(s)</p>
    </div>
  );
};

export default Queue;
