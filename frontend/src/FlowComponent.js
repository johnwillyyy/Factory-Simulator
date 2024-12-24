import React, { useState } from 'react';
import ReactFlow, { addEdge, MiniMap, Controls, Background, Handle } from 'react-flow-renderer';
import CircleNode from './CircleNode'; // Make sure the path is correct

const nodeTypes = {
  circleNode: CircleNode // Register the custom node type
};

const initialNodes = [
  { id: '1', type: 'input', data: { label: 'Input Node' }, position: { x: 100, y: 100 }, },
  { id: '2', type: 'circleNode', data: { label: 'Circle Node' }, position: { x: 300, y: 100 },style:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#FFCC00', // Yellow color
    color: 'black',
    border: '2px solid #000', // Black border
  } }, // Custom circle node
  { id: '3', type: 'output', data: { label: 'Output Node' }, position: { x: 500, y: 100 } },
];

const initialEdges = [

];

const onLoad = (reactFlowInstance) => {
  reactFlowInstance.fitView();
};

const FlowComponent = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = (changes) => setNodes((nds) => nds.map((node) => ({...node, ...changes.find((c) => c.id === node.id)})));
  const onEdgesChange = (changes) => setEdges((eds) => eds.map((edge) => ({...edge, ...changes.find((c) => c.id === edge.id)})));
  const onConnect = (params) => {setEdges((eds) => addEdge({...params}, eds));
                                    console.log(params);
}

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      onLoad={onLoad}
      nodeTypes={nodeTypes}
    >
      <MiniMap />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

export default FlowComponent;
