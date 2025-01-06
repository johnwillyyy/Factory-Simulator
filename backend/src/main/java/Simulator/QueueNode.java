package Simulator;

import Simulator.Observer.Observer;
import Simulator.Observer.Subject;
import Simulator.Service.WebSocketService;
import Simulator.SnapShot.CareTaker;
import Simulator.SnapShot.Memento;

import java.util.*;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.LinkedBlockingQueue;

public class QueueNode implements Subject {
    private String id;
    private String type;
    private Position position;
    private Data data;
    private BlockingQueue<String> blockedQueue;
    private final WebSocketService webSocketService;
    private  WebSocketData webSocketData;
    private volatile boolean paused = false;
    private final Object lock = new Object();
    ExecutorService executor;
    private final static CareTaker careTaker = new CareTaker();
    private volatile boolean isReplayState = false;
    private volatile boolean running = true;


    private List<Observer> observers;

    public void setExecutor(ExecutorService executor) {
        this.executor = executor;
        running = false;  // Signal existing thread to stop
        if (data.isInput) startQueueThread();
    }

    public QueueNode(Map<String, Object> node, WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
        this.webSocketData = new WebSocketData();

        this.id = (String) node.get("id");
        this.type = (String) node.get("type");

        Map<String, Object> posMap = (Map<String, Object>) node.get("position");
        this.position = new Position(posMap);

        Map<String, Object> dataMap = (Map<String, Object>) node.get("data");
        this.data = new Data(dataMap);

        setBlockedQueue();
    }

    private Thread queueThread;

    private void startQueueThread() {
        if (queueThread == null || !queueThread.isAlive()) {
            running = true;
            queueThread = new Thread(getAddToQueueThread());
            queueThread.start();
        }
    }

    private Runnable getAddToQueueThread() {
        return () -> {
            Random random = new Random();
            int randomInt;
            String randomColour;
            Memento memento;
            Map<String, String> stateMap = new HashMap<>();
            stateMap.put("time", "-1");
            stateMap.put("color", "dummy");
            careTaker.saveMemento(new Memento(stateMap));

            while (!executor.isShutdown()) {
                try {
                    randomInt = -1;
                    randomColour = null;

                    if (isReplayState) {
                        System.out.println("Replaying previous state for node: " + this.getId());

                        memento = careTaker.getMemento();
                        if (memento == null) {
                            System.out.println("No more mementos available. Exiting replay for node: " + this.getId());
                            running = false;
                            break;
                        }

                        randomInt = Integer.parseInt(memento.getState().get("time"));
                        randomColour = memento.getState().get("color");

                        if (randomInt == -1 || "dummy".equals(randomColour)) {
                            running = false;
                            continue;
                        }

                        System.out.println("Replayed state - Time: " + randomInt + ", Colour: " + randomColour);
                        sleepWithPause(randomInt);

                        webSocketData.setWebSocketData("None", "None", this.getId(), randomColour);
                        webSocketService.sendJsonMessage(webSocketData);

                        addToBlockedQueue(randomColour);
                        System.out.println(randomColour + " added by inputQueueThread: " + this.getId());

                    } else {
                        System.out.println("Generating new state for node: " + this.getId());

                        randomInt = 1000 + random.nextInt(9000);
                        randomColour = generateRandomColour();

                        if (isReplayState) continue;

                        stateMap = new HashMap<>();
                        stateMap.put("time", String.valueOf(randomInt));
                        stateMap.put("color", randomColour);

                        sleepWithPause(randomInt);
                        if (isReplayState) continue;

                        webSocketData.setWebSocketData("None", "None", this.getId(), randomColour);
                        webSocketService.sendJsonMessage(webSocketData);
                        addToBlockedQueue(randomColour);
                        careTaker.saveMemento(new Memento(stateMap));
                        System.out.println("State saved: " + stateMap);

                        System.out.println(randomColour + " added by inputQueueThread: " + this.getId());
                    }

                } catch (Exception e) {
                    System.err.println("Unexpected error in thread for node: " + this.getId() + " - " + e.getMessage());
                    e.printStackTrace();
                    break;
                }
            }
        };
    }

    private void stopQueueThread() {
        running = false;
        if (queueThread != null && queueThread.isAlive()) {
            queueThread.interrupt();
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
                System.err.println("Queue Interrupted during sleep.");
                break;
            }
        }
    }



    private void checkPause() {
        synchronized (lock) {
            while (paused) {
                try {
                    lock.wait();  // Wait if paused
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    System.err.println("Thread interrupted while waiting to resume.");
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

    private String generateRandomColour() {
        Random random = new Random();
        int randomInt = random.nextInt(16777215 + 1); // 0 to 16777215
        String hexColour = Integer.toHexString(randomInt).toUpperCase();
        return "#" + String.format("%6s", hexColour).replace(' ', '0');
    }

    public void setBlockedQueue() {
        this.blockedQueue = new LinkedBlockingQueue<>(this.data.getColors());
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

    public void setReplayState(boolean replayState) {
        isReplayState = replayState;
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
            notifyObservers();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.out.println("Interrupted while adding to the blocked queue: " + e.getMessage());
        }
    }

    public String removeFromBlockedQueue() {
        try {
            String product = blockedQueue.take();
            notifyObservers();
            return product;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.out.println("Interrupted while removing from the blocked queue: " + e.getMessage());
            return null;
        }
    }

    @Override
    public void addObserver(Observer observer) {
        if (observers == null){
            observers = new ArrayList<>();
        }
        observers.add(observer);
    }

    @Override
    public void removeObserver(Observer observer) {
        if (observers == null){
            observers = new ArrayList<>();
        }
        observers.remove(observer);
    }

    @Override
    public void notifyObservers() {
        if (observers == null){
            observers = new ArrayList<>();
        }
        for (Observer observer : observers){
            observer.update();
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
        private boolean isInput;


        public Data(Map<String, Object> dataMap) {
            if (dataMap != null) {
                this.label = (String) dataMap.getOrDefault("label", "Default Queue");
                this.colors = (List<String>) dataMap.getOrDefault("colors", List.of());
                this.isInput = Boolean.parseBoolean(dataMap.getOrDefault("isInput", "false").toString());
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
