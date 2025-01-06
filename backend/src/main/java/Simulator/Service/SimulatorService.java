package Simulator.Service;

import Simulator.Machine;
import Simulator.QueueNode;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
public class SimulatorService {
    private WebSocketService webSocketService = new WebSocketService();
    private Map<String, Object> components;
    private final Map<String, Object> idToNode = new HashMap<>(); // Store nodes by their ID
    ExecutorService executor = Executors.newFixedThreadPool(10);  // Pool with 10 threads
    private volatile boolean paused = false;


    public void setComponents(Map<String, Object> components, WebSocketSession session) {
        if (executor.isShutdown()){
            executor = Executors.newFixedThreadPool(10);
        }

        if (paused){
            resumeSimulation();
            return;
        }
        this.webSocketService.setSession(session);
        this.components = components;
        createComponents();
    }

    public void createComponents() {
        List<Map<String, Object>> nodes = (List<Map<String, Object>>) components.get("nodes");
        List<Map<String, Object>> edges = (List<Map<String, Object>>) components.get("edges");

        if (nodes != null) {
            // Process the nodes and add them to the idToNode map
            for (Map<String, Object> node : nodes) {
                String type = (String) node.get("type");

                if ("machine".equals(type)) {
                    Machine machine = new Machine(node,webSocketService);
                    idToNode.put(node.get("id").toString(), machine);  // Add to idToNode map

                } else if ("queue".equals(type)) {
                    QueueNode queueNode = new QueueNode(node,webSocketService);
                    idToNode.put(node.get("id").toString(), queueNode);  // Add to idToNode map
                    queueNode.setReplayState(false);

                }
            }
        }

        if (edges != null) {
            // Process the edges and establish relationships between nodes
            for (Map<String, Object> edge : edges) {
                String source = edge.get("source").toString();
                String target = edge.get("target").toString();

                // Retrieve nodes from idToNode map instead of components map
                if (source.charAt(0) == 'M' && target.charAt(0) == 'Q') {
                    Machine machine = (Machine) idToNode.get(source);
                    QueueNode queueNode = (QueueNode) idToNode.get(target);
                    machine.addNextQueues(queueNode);  // Add QueueNode to Machine's next queues
                } else if (source.charAt(0) == 'Q' && target.charAt(0) == 'M') {
                    Machine machine = (Machine) idToNode.get(target);
                    QueueNode queueNode = (QueueNode) idToNode.get(source);
                    machine.addPrevQueues(queueNode);  // Add QueueNode to Machine's prev queues
                } else {
                    throw new RuntimeException("Edges are incorrect, source and target types are incompatible");
                }
            }
        }
        startSimulation();
    }

    public void startSimulation() {

        List<Map<String, Object>> nodes = (List<Map<String, Object>>) components.get("nodes");
        for (Map<String, Object> node : nodes) {
            String type = (String) node.get("type");
            if ("machine".equals(type)) {
                String id = (String) node.get("id");
                Machine machine = (Machine) idToNode.get(id);
                machine.setExecutor(executor);
                executor.submit(machine);

            }else if ("queue".equals(type)) {
                String id = (String) node.get("id");
                QueueNode queueNode = (QueueNode) idToNode.get(id);
                queueNode.setExecutor(executor);
            }
        }
    }

    public void stopSimulation() {
        List<Map<String, Object>> nodes = (List<Map<String, Object>>) components.get("nodes");

        for (Map<String, Object> node : nodes) {
            String type = (String) node.get("type");
            if ("machine".equals(type)) {
                String id = (String) node.get("id");
                Machine machine = (Machine) idToNode.get(id);
                machine.pauseThread();
            }
            else if ("queue".equals(type)) {
                String id = (String) node.get("id");
                QueueNode queueNode = (QueueNode) idToNode.get(id);
                queueNode.pauseThread();
            }
        }
        paused = true;
    }

    public void resumeSimulation(){
        List<Map<String, Object>> nodes = (List<Map<String, Object>>) components.get("nodes");

        for (Map<String, Object> node : nodes) {
            String type = (String) node.get("type");
            if ("machine".equals(type)) {
                String id = (String) node.get("id");
                Machine machine = (Machine) idToNode.get(id);
                machine.resumeThread();
            }
            else if ("queue".equals(type)) {
                String id = (String) node.get("id");
                QueueNode queueNode = (QueueNode) idToNode.get(id);
                queueNode.resumeThread();
            }
        }
        paused = false;
    }

    public void deleteSimulation() {
        if (paused){
            resumeSimulation();
        }

        executor.shutdown();  // Graceful shutdown

        try {
            if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
                executor.shutdownNow();  // Force shutdown if not finished
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
            Thread.currentThread().interrupt();
        }
        paused = false;
    }

    public void replaySimulation() {
        List<Map<String, Object>> nodes = (List<Map<String, Object>>) components.get("nodes");

        webSocketService.sendJsonMessage(nodes);

        deleteSimulation();
        if (executor.isShutdown()){
            executor = Executors.newFixedThreadPool(10);
        }


        for (Map<String, Object> node : nodes) {
            String type = (String) node.get("type");
            if ("machine".equals(type)) {
                String id = (String) node.get("id");
                Machine machine = (Machine) idToNode.get(id);
                machine.getStyle().setBackground("#FFFFFF");

            }else if ("queue".equals(type)) {
                String id = (String) node.get("id");
                QueueNode queueNode = (QueueNode) idToNode.get(id);
                queueNode.setBlockedQueue();
                queueNode.setReplayState(true);
            }
        }
        startSimulation();
    }

}
