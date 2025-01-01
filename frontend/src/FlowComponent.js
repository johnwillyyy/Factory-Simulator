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

const nodeTypes = {
  queue: Queue,
  machine: Machine 
};
const FlowComponent = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [qCounter, setQCounter] = useState(1);
  const [mCounter, setMCounter] = useState(1);
  const [selectedElement, setSelectedElement] = useState(null);

  const [webSocket, setWebSocket] = useState(null);


  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/simulation'); // Replace with your back-end WebSocket URL
    socket.onopen = () => {
      console.log('WebSocket connected');
    };
    socket.onmessage = (event) => {
      console.log('Message from server: ', event.data);
    };
    socket.onclose = () => {
      console.log('WebSocket closed');
    };

    setWebSocket(socket);

    return () => {
      socket.close(); 
    };
  }, []);




  const onNodesChange = useCallback(async (changes) => {
    setNodes((ns) => applyNodeChanges(changes, ns));
  }, []);


  const onEdgesChange = useCallback((changes) => setEdges((es) => applyEdgeChanges(changes, es)), []);

  const addMachineNode =  () => {
    const newNode = {
      id: `M ${mCounter}`,
      type: 'machine',
      position: { x: Math.random() * window.innerWidth / 3, y: Math.random() * window.innerHeight / 3 },
      data: { label: 'New Machine Node' , time: Math.floor(Math.random() * (25 - 5 + 1)) + 5},
      style: { 
        background: "#FFFFFF",
        border: "3px solid gray" , 
        borderRadius: "5px", 
      }
    };
    setMCounter((count) => count+1);
    setNodes((ns) => [...ns, newNode]);
  };

  const addQueueNode = () => {
    const newNode = {
      id: `Q ${qCounter}`,
      type: 'queue',
      position: { x: Math.random() * window.innerWidth / 3, y: Math.random() * window.innerHeight / 3 },
      data: { label: 'New Queue Node', colors:["blue","blue","blue","blue","blue","blue","blue","blue","blue"  ] }
    };
    setQCounter((count) => count+1);
    setNodes((ns) => [...ns, newNode]);
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
    console.log(edges)
    setEdges((eds) => [...eds, { ...params, id: `e${params.source}-${params.target}` }]);
  }, [nodes]);
  
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Delete' && selectedElement) {
        if (selectedElement.id.startsWith('e')) {
          setEdges((es) => es.filter((edge) => edge.id !== selectedElement.id));
        } else {
          setNodes((ns) => ns.filter((node) => node.id !== selectedElement.id));
        }
        setSelectedElement(null);
      }
    },
    [selectedElement, setEdges, setNodes]
  );


  const onSelectionChange = ({ nodes, edges }) => {
    if (nodes.length > 0) {
      setSelectedElement(nodes[0]); // If a node is selected
    } else if (edges.length > 0) {
      setSelectedElement(edges[0]); // If an edge is selected
    } else {
      setSelectedElement(null); // If nothing is selected
    }
  };

  const startNewSimulation = () => {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      const simulationData = {
        nodes,
        edges,
      };
      webSocket.send(JSON.stringify(simulationData));
      console.log('Sent simulation data:', simulationData);
    } else {
      console.error('WebSocket is not open. Cannot send data.');
    }
  };

  useEffect(() => {
    const handleDown = (e) => {
      if (e.key === "Delete") {
        handleKeyDown(e);
      }
    };
  
    window.addEventListener("keydown", handleDown); 
  
    return () => {
      window.removeEventListener("keydown", handleDown); 
    };
  }, [handleKeyDown]); 
  


  return (
    <ReactFlowProvider>
      <div style={{ height: 750 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onSelectionChange={onSelectionChange}
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
          <button className={styles.button}onClick={startNewSimulation}>
            Start New Simulation
          </button>
          <button className={styles.button} >
            Replay Simulation
          </button>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowComponent;
