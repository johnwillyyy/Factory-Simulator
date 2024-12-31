package Simulator;

import java.util.Map;
import java.util.PriorityQueue;

public class Machine implements Runnable {
    private String id;
    private String type;
    private Position position;
    private Data data;
    private Style style;

    QueueNode nextChosenQueue;
    QueueNode prevChosenQueue;

    PriorityQueue<QueueNode> nextQueueNodes;    //Priority queue to choose most empty queue
    PriorityQueue<QueueNode> prevQueueNodes;    //No pop operation is done, only peek()

    public void addNextQueues(QueueNode queueNode){
        nextQueueNodes.add(queueNode);
    }

    public void addPrevQueues(QueueNode queueNode){
        prevQueueNodes.add(queueNode);
    }

    private void setNextQueue(){
        nextChosenQueue = nextQueueNodes.peek();
    }

    private void setPrevQueue(){
        prevChosenQueue = prevQueueNodes.peek();
    }


    public Machine(Map<String, Object> node) {
        nextQueueNodes = new PriorityQueue<>((queue1, queue2) -> Integer.compare(queue1.getSize(), queue2.getSize()));
        prevQueueNodes = new PriorityQueue<>((queue1, queue2) -> Integer.compare(queue1.getSize(), queue2.getSize()));


        this.id = (String) node.get("id");
        this.type = (String) node.get("type");

        Map<String, Object> posMap = (Map<String, Object>) node.get("position");
        this.position = new Position(posMap);

        Map<String, Object> dataMap = (Map<String, Object>) node.get("data");
        this.data = new Data(dataMap);

        Map<String, Object> styleMap = (Map<String, Object>) node.get("style");
        this.style = new Style(styleMap);
    }

    @Override
    public void run() {
        System.out.println(this.getData().getLabel() + " is running.");
        try {
            Thread.sleep(this.getData().getTime() * 1000L);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.out.println("Machine " + id + " interrupted.");
        }
        System.out.println(this.getData().getLabel() + " completed.");
    }

    // Position Class
    public static class Position {
        private double x;
        private double y;

        public Position(Map<String, Object> posMap) {
            if (posMap != null) {
                this.x = (double) posMap.getOrDefault("x", 0.0);
                this.y = (double) posMap.getOrDefault("y", 0.0);
            }
        }

        // Getters and Setters
        public double getX() { return x; }
        public void setX(double x) { this.x = x; }
        public double getY() { return y; }
        public void setY(double y) { this.y = y; }
    }

    // Data Class
    public static class Data {
        private String label;
        private int time;

        public Data(Map<String, Object> dataMap) {
            if (dataMap != null) {
                this.label = (String) dataMap.getOrDefault("label", "Default Machine");
                this.time = (int) dataMap.getOrDefault("time", 10);
            }
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public int getTime() { return time; }
        public void setTime(int time) { this.time = time; }
    }

    // Style Class
    public static class Style {
        private String background;

        public Style(Map<String, Object> styleMap) {
            if (styleMap != null) {
                this.background = (String) styleMap.getOrDefault("background", "#FFFFFF");
            }
        }

        public String getBackground() { return background; }
        public void setBackground(String background) { this.background = background; }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Position getPosition() { return position; }
    public void setPosition(Position position) { this.position = position; }
    public Data getData() { return data; }
    public void setData(Data data) { this.data = data; }
    public Style getStyle() { return style; }
    public void setStyle(Style style) { this.style = style; }
}
