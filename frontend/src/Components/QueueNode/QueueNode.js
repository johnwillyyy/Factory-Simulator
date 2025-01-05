import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { FaPlus } from 'react-icons/fa'; // Import Font Awesome Plus Icon
import styles from './Queue.module.css';

const Queue = ({ data, id }) => {
  return (
    <div className={styles.queueContainer}>
      <p>{id}</p>
      <Handle type="source" position={Position.Left} className={styles.handle} />
      <div className={styles.scrollContainer}>
      {data.colors && data.colors.length > 0 ? (
        data.colors.map((color, index) => (
          <div
            key={index}
            className={styles.circle}
            style={{ backgroundColor: color }}
          ></div>
        ))
      ) : (
        <p className={styles.emptyMessage}>Empty</p>
      )}
    </div>
      <Handle type="target" position={Position.Right} className={styles.handle} />
      <p>{data.colors.length} product(s)</p>
      
      {data.isInput && (<button 
        onClick={() => data.onAddColor(id)} 
        className={styles.addButton}>
        <FaPlus />
      </button>)}

    </div>
  );
};

export default Queue;
