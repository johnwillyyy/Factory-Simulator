package Simulator.SnapShot;

import java.util.Map;

public class Memento {
    private Map<String, String> state;

    public Memento(Map state) {
        this.state = state;
    }

    public Map<String, String> getState() {
        return state;
    }
}
