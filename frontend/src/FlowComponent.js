import React, { useState,useCallback, useEffect  } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  applyNodeChanges, applyEdgeChanges
} from 'react-flow-renderer';
import Queue from './Components/QueueNode/QueueNode';
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
    const socket = new WebSocket('ws://localhost:8080/simulation');
  
    socket.onopen = () => {
      console.log('WebSocket connected');
    };
  
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received data:', data);
        console.log("Nodes",nodes);
        setNodes((prevNodes) =>
          prevNodes.map((node) => {
            if (node.id === data.machineId) {
              return {
                ...node,
                style: {
                  ...node.style,
                  backgroundColor: data.color,
                },
              };
            }
            
            if (node.id === data.prevQueueId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  colors: removeFirstAppearance(node.data.colors, data.color)
                }
              };
            }
            
            if (node.id === data.nextQueueId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  colors: [...node.data.colors, data.color] // Append colour to the end
                }
              };
            }
            
            return node;
          })
        );
        
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
  
    socket.onclose = () => {
      console.log('WebSocket closed');
    };
  
    setWebSocket(socket);
    return () => {
      socket.close();
    };
  }, []);
  
  
  function removeFirstAppearance(colors, colorToRemove) {
    const index = colors.indexOf(colorToRemove);
    if (index !== -1) {
      return [...colors.slice(0, index), ...colors.slice(index + 1)];
    }
    return colors;
  }


  const addRandomColor = (nodeId) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                colors: [
                  ...node.data.colors,
                  `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
                ],
              },
            }
          : node
      )
    );
  };



  const onNodesChange = useCallback(async (changes) => {
    setNodes((ns) => applyNodeChanges(changes, ns));
  }, []);


  const onEdgesChange = useCallback((changes) => setEdges((es) => applyEdgeChanges(changes, es)), []);

  const addMachineNode =  () => {
    const newNode = {
      id: `M ${mCounter}`,
      type: 'machine',
      position: { x: Math.random() * window.innerWidth / 3, y: Math.random() * window.innerHeight / 3 },
      data: { label: 'New Machine Node' , time: 5},
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
      data: { label: 'New Queue Node', colors:[], isInput: false }
    };
    setQCounter((count) => count+1);
    setNodes((ns) => [...ns, newNode]);
  };

  const addInputQueue = () => {
    const newNode = {
      id: `Q ${qCounter}`,
      type: 'queue',
      position: { x: Math.random() * window.innerWidth / 3, y: Math.random() * window.innerHeight / 3 },
      data: { label: 'New Queue Node', colors:[], isInput: true }
    };
    setQCounter((count) => count+1);
    setNodes((ns) => [...ns, newNode]);
    console.log(nodes)

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
      setSelectedElement(nodes[0]); 
    } else if (edges.length > 0) {
      setSelectedElement(edges[0]); 
    } else {
      setSelectedElement(null); 
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
          nodes={nodes.map((node) =>
            node.type === 'queue'
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    onAddColor: addRandomColor, 
                  },
                }
              : node
          )}
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
            Add Machine
          </button>
          <button className={styles.button} onClick={addQueueNode}>
            Add Queue 
          </button>
          <button className={styles.button} onClick={addInputQueue}>
            Add Input Queue
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
