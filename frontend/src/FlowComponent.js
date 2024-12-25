import React, { useState,useCallback  } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  applyNodeChanges, applyEdgeChanges
} from 'react-flow-renderer';
import Queue from './QueueNode'; // Import your custom node
import Machine from './MachineNode';

const initialNodes = [
];

const nodeTypes = {
  queue: Queue,
  machine: Machine // Register the custom node type
};

const FlowComponent = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback((changes) => setNodes((ns) => applyNodeChanges(changes, ns)), []);
  const onEdgesChange = useCallback((changes) => setEdges((es) => applyEdgeChanges(changes, es)), []);

  const addMachineNode = () => {
    const newNode = {
      id: `machine_${+new Date()}`,
      type: 'machine',
      position: { x: Math.random() * window.innerWidth / 3, y: Math.random() * window.innerHeight / 3 },
      data: { label: 'New Machine Node' }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const addQueueNode = () => {
    const newNode = {
      id: `queue_${+new Date()}`,
      type: 'queue',
      position: { x: Math.random() * window.innerWidth / 3, y: Math.random() * window.innerHeight / 3 },
      data: { label: 'New Queue Node' }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const onConnect = useCallback((params) => {
    setEdges((eds) => [...eds, { ...params, id: `e${params.source}-${params.target}` }]);
  }, []);
  


  return (
    <ReactFlowProvider>
      <div style={{ height: 600 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect} // Add this line

                    fitView
        >
          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>

        <button onClick={addMachineNode} style={{ position: 'absolute', right: '10px', top: '50px', zIndex: 100 }}>
        Add Machine Node
        </button>
        <button onClick={addQueueNode} style={{ position: 'absolute', right: '10px', top: '90px', zIndex: 100 }}>
        Add Queue Node
        </button>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowComponent;
