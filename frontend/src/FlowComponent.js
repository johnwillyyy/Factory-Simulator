import React, { useState,useCallback, useEffect  } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  applyNodeChanges, applyEdgeChanges
} from 'react-flow-renderer';
import Queue from './QueueNode'; // Import your custom node
import Machine from './MachineNode';
import styles from './FlowComponent.module.css'
import { sendMachineToBackend, sendQueueToBackend } from './apiService'; // Adjust path as needed


const initialNodes = [{
  id: 'queue_1',
  type: 'queue',
  position: { x: 100, y: 100 },
  data: { label: 'Queue Example', colors: ['#ff0000', '#00ff00', '#0000ff','#ff0000', '#00ff00', '#0000ff','#ff0000', '#00ff00', '#0000ff','#ff0000', '#00ff00', '#0000ff'] } // Demo colors
}];

const nodeTypes = {
  queue: Queue,
  machine: Machine // Register the custom node type
};

const FlowComponent = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [qCounter, setQCounter] = useState(1);
  const [mCounter, setMCounter] = useState(1);



  const onNodesChange = useCallback((changes) => setNodes((ns) => applyNodeChanges(changes, ns)), []);
  const onEdgesChange = useCallback((changes) => setEdges((es) => applyEdgeChanges(changes, es)), []);

  const addMachineNode = () => {
    const newNode = {
      id: `M ${mCounter}`,
      type: 'machine',
      position: { x: Math.random() * window.innerWidth / 3, y: Math.random() * window.innerHeight / 3 },
      data: { label: 'New Machine Node' }
    };
    setMCounter((count) => count+1);
    setNodes((nds) => [...nds, newNode]);
    sendMachineToBackend(newNode);

  };

  const addQueueNode = () => {
    const newNode = {
      id: `Q ${qCounter}`,
      type: 'queue',
      position: { x: Math.random() * window.innerWidth / 3, y: Math.random() * window.innerHeight / 3 },
      data: { label: 'New Queue Node', colors:[] }
    };
    setQCounter((count) => count+1);
    setNodes((nds) => [...nds, newNode]);
    sendQueueToBackend(newNode);

  };

  const onConnect = useCallback((params) => {
    console.log("Current nodes:", nodes);
    const sourceNode = nodes.find(node => node.id === params.source);
    const targetNode = nodes.find(node => node.id === params.target);
  
    console.log("Source Node:", sourceNode);
    console.log("Target Node:", targetNode);
  
    if (sourceNode && targetNode && sourceNode.type === targetNode.type) {
      alert("Cannot connect nodes of the same type.");
      console.log("Connection attempt between nodes of the same type was blocked.");
      return;
    }
  
    setEdges((eds) => [...eds, { ...params, id: `e${params.source}-${params.target}` }]);
  }, [nodes]);
  

  useEffect(() => {
    console.log(edges);
  }, [edges]);
  


  return (
    <ReactFlowProvider>
      <div style={{ height: 600 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
        <div className={styles.container}>
          <button className={styles.button} onClick={addMachineNode}>
            Add Machine Node
          </button>
          <button className={styles.button} onClick={addQueueNode}>
            Add Queue Node
          </button>
          <button className={styles.button}>
            Start New Simulation
          </button>
          <button className={styles.button}>
            Replay Simulation
          </button>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowComponent;
