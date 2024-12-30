package Simulator;

import java.util.List;

public class Queue {

    private String id;
    private String type;
    private Position position;
    private Data data;

    // Getters and Setters
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

    @Override
    public String toString() {
        return "Queue{" +
                "id='" + id + '\'' +
                ", type='" + type + '\'' +
                ", position=" + position +
                ", data=" + data +
                '}';
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

        @Override
        public String toString() {
            return "Data{" +
                    "label='" + label + '\'' +
                    ", colors=" + colors +
                    '}';
        }
    }
}
