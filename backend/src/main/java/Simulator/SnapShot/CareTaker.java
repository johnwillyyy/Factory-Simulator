package Simulator.SnapShot;
import org.springframework.stereotype.Component;

import java.util.LinkedList;
import java.util.Queue;

@Component
public class CareTaker {
    private Queue<Memento> mementoQueue = new LinkedList<>() {
    };

    public void saveMemento(Memento memento) {
        mementoQueue.add(memento);
    }

    public Memento getMemento() {
        if (!mementoQueue.isEmpty()) {
            return mementoQueue.poll();
        }
        else return null;
    }
}
