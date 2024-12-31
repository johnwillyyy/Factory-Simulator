package Simulator.Service;

import Simulator.Machine;
import Simulator.QueueNode;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SimulatorService {
    private Map<String, Object> components;
    private final Map<String, Object> idToNode = new HashMap<>(); // Store nodes by their ID

    public void setComponents(Map<String, Object> components) {
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
                    Machine machine = new Machine(node);
                    idToNode.put(node.get("id").toString(), machine);  // Add to idToNode map

                } else if ("queue".equals(type)) {
                    QueueNode queueNode = new QueueNode(node);
                    idToNode.put(node.get("id").toString(), queueNode);  // Add to idToNode map
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
    }
}
