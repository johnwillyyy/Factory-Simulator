package Simulator;

import Simulator.Observer.Observer;
import Simulator.Service.WebSocketService;

import java.util.*;
import java.util.concurrent.ExecutorService;

public class Machine implements Runnable, Observer {
    ExecutorService executor;
    private boolean isProcessing = false;
    private boolean isUpdateMissed = false;
    private final WebSocketService webSocketService;
    private  WebSocketData webSocketData;
    private volatile boolean paused = false;
    private final Object lock = new Object();




    private String id;
    private String type;
    private Position position;
    private Data data;
    private Style style;

    QueueNode nextChosenQueue;
    QueueNode prevChosenQueue;

    List<QueueNode> nextQueueNodes;    // List to store next queues
    List<QueueNode> prevQueueNodes;    // List to store previous queues


    public void setExecutor(ExecutorService executor) {
        this.executor = executor;
    }

    public void addNextQueues(QueueNode queueNode){
        nextQueueNodes.add(queueNode);
        queueNode.addObserver(this);
    }

    public void addPrevQueues(QueueNode queueNode){
        prevQueueNodes.add(queueNode);
        queueNode.addObserver(this);
    }

    private void setNextQueue(){
        nextChosenQueue = nextQueueNodes.stream()
                .min(Comparator.comparingInt(QueueNode::getSize))
                .orElse(null);
    }

    private void setPrevQueue(){
        prevChosenQueue = prevQueueNodes.stream()
                .max(Comparator.comparingInt(QueueNode::getSize))
                .orElse(null);
    }

    public Machine(Map<String, Object> node,WebSocketService webSocketService) {

        this.webSocketService = webSocketService;
        this.webSocketData = new WebSocketData();
        nextQueueNodes = new ArrayList<>(); // Initialize as a List
        prevQueueNodes = new ArrayList<>(); // Initialize as a List

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
        try {
            if (Objects.equals(getStyle().getBackground(), "#FFFFFF")) {
                isProcessing = true;
                setPrevQueue();
                String productColour = prevChosenQueue.removeFromBlockedQueue();
                System.out.println(prevChosenQueue.getId() + " Prev Size: " + prevChosenQueue.getSize());

                if (productColour != null) {
                    System.out.println(id + " working!");
                    webSocketData.setWebSocketData(id, prevChosenQueue.getId(), "None", productColour);
                    System.out.println(id + " working! with " + productColour);
                    webSocketService.sendJsonMessage(webSocketData);
                    this.getStyle().setBackground(productColour);
                    prevChosenQueue.notifyObservers(); //notify after background change


                    sleepWithPause(this.getData().getTime() * 1000L);

                    this.getStyle().setBackground("#FFFFFF");
                    setNextQueue();
                    webSocketData.setWebSocketData("None", "None", nextChosenQueue.getId(), productColour);
                    webSocketService.sendJsonMessage(webSocketData);
                    webSocketData.setWebSocketData(id, "None", "None", "#FFFFFF");
                    webSocketService.sendJsonMessage(webSocketData);
                    nextChosenQueue.addToBlockedQueue(productColour);
                    System.out.println(id + " finished!");
                    System.out.println(nextChosenQueue.getId() + " Next Size: " + nextChosenQueue.getSize());


                    sleepWithPause(1000);

                } else {
                    System.out.println("No products in queue for machine " + getId());
                }
            }
        } catch (Exception e) {
            System.out.println("Machine " + getId() + " interrupted during processing.");
        } finally {
            isProcessing = false;
            // If an update was missed while processing, resubmit the task
            if (isUpdateMissed) {
                isUpdateMissed = false;
                executor.submit(this);
            }
        }
    }

    private void sleepWithPause(long totalSleepTimeMs) {
        long remainingTime = totalSleepTimeMs;
        long sleepInterval = 100; // Sleep in 100 ms chunks

        while (remainingTime > 0) {
            checkPause();
            try {
                Thread.sleep(Math.min(sleepInterval, remainingTime));
                remainingTime -= sleepInterval;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.out.println("Machine Interrupted during sleep.");
                break;
            }
        }
    }

    // Method to check if the thread is paused
    private void checkPause() {
        synchronized (lock) {
            while (paused) {
                try {
                    lock.wait();  // Wait if paused
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    System.out.println("Machine Thread interrupted while waiting to resume.");
                }
            }
        }
    }

    // Pause the thread
    public void pauseThread() {
        synchronized (lock) {
            paused = true;  // Set the paused flag
        }
    }

    // Resume the thread
    public void resumeThread() {
        synchronized (lock) {
            paused = false;  // Clear the paused flag
            lock.notify();   // Notify the waiting thread to resume
        }
    }


    @Override
    public void update() {
        if (!executor.isShutdown()) {
            if (!isProcessing) {
                executor.submit(this);
                isUpdateMissed = false;
            } else {
                isUpdateMissed = true;
            }
        }
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
