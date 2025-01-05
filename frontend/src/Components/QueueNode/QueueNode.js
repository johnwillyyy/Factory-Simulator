import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { FaPlus } from 'react-icons/fa'; // Import Font Awesome Plus Icon
import { FaLemon } from 'react-icons/fa';

import styles from './Queue.module.css';

const Queue = ({ data, id }) => {
  return (
    <>
      <p className={styles.productCount}>Product Count {data.colors.length}</p>
      <div className={styles.queueContainer}>
        <Handle type="source" position={Position.Left} className={styles.handle} />
        
        <div className={styles.scrollContainer}>
          {data.colors && data.colors.length > 0 ? (
            data.colors.map((color, index) => (
              <FaLemon size={15} color={color} className={styles.product} />
            ))
          ) : (
            <p className={styles.emptyMessage}>Empty</p>
          )}
        </div>


        <Handle type="target" position={Position.Right} className={styles.handle} />

        {data.isInput && (
          <button onClick={() => data.onAddColor(id)} className={styles.addButton}>
            +
          </button>
        )}
      </div>
    </>
  );
};

export default Queue;
