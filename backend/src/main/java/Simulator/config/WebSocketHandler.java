package Simulator.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;

public class WebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public void handleTextMessage(WebSocketSession session, TextMessage message) throws InterruptedException, IOException {
        String incomingMessage = message.getPayload();
        System.out.println("Received message: " + incomingMessage);
        session.sendMessage(new TextMessage("Simulation started!"));
    }
}
