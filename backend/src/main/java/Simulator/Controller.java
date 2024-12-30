package Simulator;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
public class Controller {
    private final List<Object> nodeList = new ArrayList<>();
    Random random = new Random();

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/createMachine")
    public ResponseEntity<List<Object>> createMachineNode(@RequestBody Machine machine) {
        System.out.println("Received Machine Node: " + machine);
        Machine.Data data = new Machine.Data();
        data.setTime( random.nextInt(15 - 5 + 1) + 5);
        machine.setData(data);

        nodeList.add(machine);
        return new ResponseEntity<>(nodeList, HttpStatus.CREATED);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/createQueue")
    public ResponseEntity<List<Object>> createQueueNode(@RequestBody Queue queue) {
        System.out.println("Received Queue Node: " + queue);
        nodeList.add(queue);
        return new ResponseEntity<>(nodeList, HttpStatus.CREATED);
    }

}
