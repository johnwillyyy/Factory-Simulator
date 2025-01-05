package Simulator.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.TextMessage;
import java.io.IOException;

@Service
public class WebSocketService {
    private final ObjectMapper objectMapper;
    @Setter
    private volatile WebSocketSession session;
    private final Object sendLock = new Object();

    public WebSocketService() {
        this.objectMapper = new ObjectMapper();
    }

    public void sendJsonMessage(Object data) {
        synchronized (sendLock) {
            if (session == null || !session.isOpen()) {
                System.err.println("WebSocket session is not open or is null.");
                return;
            }

            try {
                // Add small delay to ensure message ordering
                Thread.sleep(1);
                String jsonString = objectMapper.writeValueAsString(data);
                session.sendMessage(new TextMessage(jsonString));
                // Add small delay after sending
                Thread.sleep(1);
            } catch (IOException e) {
                System.err.println("Failed to send WebSocket message: " + e.getMessage());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.err.println("Interrupted while sending message");
            }
        }
    }
}
