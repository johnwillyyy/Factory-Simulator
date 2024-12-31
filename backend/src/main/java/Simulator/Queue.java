package Simulator;

import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class Queue {

    private String id;
    private String type;
    private Position position;
    private Data data;
    private BlockingQueue<String> blockedQueue;

    // Getters and Setters
    public String getId() {
        return id;
    }
    public Queue() {
        this.blockedQueue = new LinkedBlockingQueue<>(); // Initialize the blocked queue
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }
    public BlockingQueue<String> getBlockedQueue() {
        return blockedQueue;
    }


    public void addToBlockedQueue(String element) {
        try {
            blockedQueue.put(element); // Add element to the queue (blocks if full)
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // Restore interrupted status
            System.out.println("Interrupted while adding to the blocked queue: " + e.getMessage());
        }
    }

    public String removeFromBlockedQueue() {
        try {
            return blockedQueue.take(); // Remove element from the queue (blocks if empty)
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // Restore interrupted status
            System.out.println("Interrupted while removing from the blocked queue: " + e.getMessage());
            return null;
        }
    }


    // Inner class for Position
    public static class Position {
        private double x;
        private double y;

        public double getX() {
            return x;
        }

        public void setX(double x) {
            this.x = x;
        }

        public double getY() {
            return y;
        }

        public void setY(double y) {
            this.y = y;
        }

        @Override
        public String toString() {
            return "Position{" +
                    "x=" + x +
                    ", y=" + y +
                    '}';
        }
    }

    // Inner class for Data
    public static class Data {
        private String label;
        private List<String> colors;

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public List<String> getColors() {
            return colors;
        }

        public void setColors(List<String> colors) {
            this.colors = colors;
        }



    }
}
