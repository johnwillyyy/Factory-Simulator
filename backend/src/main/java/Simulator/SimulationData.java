package Simulator;

import java.util.List;

public class SimulationData {
    private List<Machine> machines;
    private List<QueueNode> queueNodes;
    private List<Edge> edges;
    public List<Machine> getMachines() {
        return machines;
    }

    public void setMachines(List<Machine> machines) {
        this.machines = machines;
    }

    public List<QueueNode> getQueues() {
        return queueNodes;
    }

    public void setQueues(List<QueueNode> queueNodes) {
        this.queueNodes = queueNodes;
    }

    public List<Edge> getEdges() {
        return edges;
    }

    public void setEdges(List<Edge> edges) {
        this.edges = edges;
    }

}
