package Simulator;

import java.util.List;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class QueueNode {
    private String id;
    private String type;
    private Position position;
    private Data data;
    private BlockingQueue<String> blockedQueue;

    public QueueNode(Map<String, Object> node) {
        this.id = (String) node.get("id");
        this.type = (String) node.get("type");

        Map<String, Object> posMap = (Map<String, Object>) node.get("position");
        this.position = new Position(posMap);

        Map<String, Object> dataMap = (Map<String, Object>) node.get("data");
        this.data = new Data(dataMap);

        this.blockedQueue = new LinkedBlockingQueue<>();
    }

    public void setBlockedQueue(BlockingQueue<String> blockedQueue) {
        this.blockedQueue = (BlockingQueue<String>) this.data.getColors();
    }

    public int getSize(){
        return this.blockedQueue.size();
    }

    public String getId() {
        return id;
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
            blockedQueue.put(element);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.out.println("Interrupted while adding to the blocked queue: " + e.getMessage());
        }
    }

    public String removeFromBlockedQueue() {
        try {
            return blockedQueue.take();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.out.println("Interrupted while removing from the blocked queue: " + e.getMessage());
            return null;
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

    // Data Class
    public static class Data {
        private String label;
        private List<String> colors;

        public Data(Map<String, Object> dataMap) {
            if (dataMap != null) {
                this.label = (String) dataMap.getOrDefault("label", "Default Queue");
                this.colors = (List<String>) dataMap.getOrDefault("colors", List.of());
            }
        }

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
