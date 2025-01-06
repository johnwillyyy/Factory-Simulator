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
  const [isSocketOpen, setIsSocketOpen] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [paused, setPaused] = useState(false);



  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/simulation');
  
    socket.onopen = () => {
      console.log('WebSocket connected');
      setIsSocketOpen(true); // WebSocket is open

    };
  
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received data:', data);
        console.log("Nodes",nodes);
        console.log(data.machineId)
        if(!(data.machineId || data.prevQueueId || data.nextQueueId)){
          setNodes(data)
          console.log("replayed: "+data)
        }else{
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
      }
        
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
  
    socket.onclose = () => {
      console.log('WebSocket closed');
      setIsSocketOpen(false); // WebSocket is open

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
      data: { label: 'New Machine Node' , time: Math.floor(Math.random() * (15 - 5 + 1)) + 5},
      style: { 
        background: "#FFFFFF",
        border: "2px solid gray" , 
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

  const deleteSimulation = () => {
    setNodes([]);
    setEdges([]);
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      // You can send a message or just stop any ongoing updates from the WebSocket here
      webSocket.send(JSON.stringify({ action: 'delete' }));
      console.log('Simulation deleted');
      setPaused(false);
      setSimulating(false);

    } else {
      console.error('WebSocket is not open. Cannot send data.');
    }
  };

  const clearSimulation = () => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node, // Spread the existing node properties
        data: {
          ...node.data, // Spread the existing node's data properties
          colors: [] // Reset colors to an empty array
        }
      }))
    );
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
      setSimulating(true); // Mark the simulation as paused
      setPaused(false);
    } else {
      console.error('WebSocket is not open. Cannot send data.');
    }
  };

  const pauseSimulation = () => {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      // You can send a message or just stop any ongoing updates from the WebSocket here
      webSocket.send(JSON.stringify({ action: 'pause' }));
      console.log('Simulation paused');
      setPaused(true);
    } else {
      console.error('WebSocket is not open. Cannot send data.');
    }
  };
  
  const ReplaySimulation = () => {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      // You can send a message or just stop any ongoing updates from the WebSocket here
      webSocket.send(JSON.stringify({ action: 'replay' }));
      console.log('Simulation replayed');
      setPaused(false);
      setSimulating(true);
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
      <div style={{ height: 770 }}>
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
          <button className={simulating ? styles.disabledButton : styles.enabledButton} onClick={addMachineNode} disabled={simulating}>
            Add Machine
          </button>
          <button className={simulating ? styles.disabledButton : styles.enabledButton} onClick={addQueueNode} disabled={simulating} // Disable the button if WebSocket is open
          >
            Add Queue 
          </button>
          <button className={simulating ? styles.disabledButton : styles.enabledButton} onClick={addInputQueue}  disabled={simulating} // Disable the button if WebSocket is open
          >
            Add Input Queue
          </button>
          <button className={simulating ? (paused? styles.enabledButton : styles.disabledButton) : styles.enabledButton} onClick={startNewSimulation} disabled={!((simulating && paused) || !simulating)}>
            Start Simulation
          </button>
          <button className={simulating ? styles.disabledButton : styles.enabledButton} onClick={clearSimulation} disabled={simulating}>
            Clear Simulation
          </button>
          <button className={styles.enabledButton} onClick={deleteSimulation}>
            Delete Simulation
          </button>
          <button className={simulating ? (paused? styles.enabledButton : styles.disabledButton) : styles.enabledButton} onClick={ReplaySimulation} disabled={!((simulating && paused) || !simulating)}>
            Replay Simulation
          </button>
          <button className={!simulating ? styles.disabledButton : styles.enabledButton} onClick={pauseSimulation} disabled={!simulating}>
            Pause
          </button>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowComponent;
