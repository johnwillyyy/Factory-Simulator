import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import styles from './Machine.module.css';
import machineIcon from '../../assets/machine_icon.png';

const Machine = ({ id , data}) => {
  return (
    
    <>
    <p className={styles.machineTime}>Time:  {data.time}</p>
    <div>
    <div className={styles.machineNode}>
      <Handle
        type="source"
        position={Position.Left}
        className={styles.handle}
      />
      <img src={machineIcon} alt="Machine" className={styles.machineIcon} />

      <Handle
        type="target"
        position={Position.Right}
        className={styles.handle}
      />
    </div>
    </div>
    </>
  );
};

export default Machine;
