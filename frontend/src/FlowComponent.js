import React, { useState,useCallback, useEffect  } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  applyNodeChanges, applyEdgeChanges
} from 'react-flow-renderer';
import Queue from './Components/QueueNode/QueueNode'; // Import your custom node
import Machine from './Components/MachineNode/MachineNode';
import styles from './FlowComponent.module.css'
import { sendMachineToBackend, sendQueueToBackend,sendNodeChangeToBackend } from './Services/apiService'; // Adjust path as needed


const initialNodes = [];

const nodeTypes = {
  queue: Queue,
  machine: Machine // Register the custom node type
};

const FlowComponent = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [qCounter, setQCounter] = useState(1);
  const [mCounter, setMCounter] = useState(1);



  const onNodesChange = useCallback(async (changes) => {
    setNodes((ns) => applyNodeChanges(changes, ns)); // Update local state
  
    // Iterate over changes to handle moved nodes

  }, []);


  const handleNodeDragStop = useCallback(
    async (event, node) => {
      const { id, position } = node; // Extract the node ID and final position
      const updatedNode = { id, x: position.x, y: position.y };
  
      console.log("Node drag stopped:", updatedNode);
  
      // Send the updated node's position to the backend
      const updatedList = await sendNodeChangeToBackend(updatedNode);
      if (updatedList) {
        setNodes(updatedList); // Update local nodes with the updated list from the backend
      }
    },
    [setNodes]
  );
  
  
  
  const onEdgesChange = useCallback((changes) => setEdges((es) => applyEdgeChanges(changes, es)), []);

  const addMachineNode = async () => {
    const newNode = {
      id: `M ${mCounter}`,
      type: 'machine',
      position: { x: Math.random() * window.innerWidth / 3, y: Math.random() * window.innerHeight / 3 },
      data: { label: 'New Machine Node' , time: 0},
      style: { background: "#FFFFFF" } 
    };
    console.log(newNode);
    setMCounter((count) => count+1);
    const updatedMachines = await sendMachineToBackend(newNode);
    if (updatedMachines) {
      setNodes(updatedMachines); // Update the local state with the returned list
    }
  };

  const addQueueNode = async () => {
    const newNode = {
      id: `Q ${qCounter}`,
      type: 'queue',
      position: { x: Math.random() * window.innerWidth / 3, y: Math.random() * window.innerHeight / 3 },
      data: { label: 'New Queue Node', colors:[] }
    };
    console.log(newNode);
    setQCounter((count) => count+1);

    const updatedQueues = await sendQueueToBackend(newNode);
    if (updatedQueues) {
      setNodes(updatedQueues);
    }
    
  };

  const onConnect = useCallback((params) => {
    console.log("Current nodes:", nodes);
    const sourceNode = nodes.find(node => node.id === params.source);
    const targetNode = nodes.find(node => node.id === params.target);
  
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
          onNodeDragStop={handleNodeDragStop} // Add the handler
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
