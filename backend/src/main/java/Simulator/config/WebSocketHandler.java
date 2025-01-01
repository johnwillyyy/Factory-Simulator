package Simulator.config;

import Simulator.Service.SimulatorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private final SimulatorService simulatorService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public WebSocketHandler() {
        this.simulatorService = new SimulatorService();
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        String incomingMessage = message.getPayload();
        System.out.println("Received message: " + incomingMessage);

        Map<String, Object> messageMap = objectMapper.readValue(incomingMessage, Map.class);
        try {
            simulatorService.setComponents(messageMap,session);
            session.sendMessage(new TextMessage("Simulation started!"));
        }catch (RuntimeException e){
            session.sendMessage(new TextMessage("Simulation failed!"));
        }
    }
}
