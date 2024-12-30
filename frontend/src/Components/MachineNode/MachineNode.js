import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import styles from './Machine.module.css';
import machineIcon from '../../assets/machine_icon.png';

const Machine = ({ id , data}) => {
  return (
    <div className={styles.machineNode}>
      <Handle
        type="source"
        position={Position.Left}
        className={styles.handle}
      />
      <img src={machineIcon} alt="Machine" className={styles.machineIcon} />
        {id} + {data.time}
      <Handle
        type="target"
        position={Position.Right}
        className={styles.handle}
      />
    </div>
  );
};

export default Machine;
