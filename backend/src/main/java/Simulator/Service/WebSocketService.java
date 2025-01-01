package Simulator.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.TextMessage;
import java.io.IOException;

@Service
public class WebSocketService {

    private WebSocketSession session;
    private final ObjectMapper objectMapper;

    public WebSocketService() {
        this.objectMapper = new ObjectMapper();
    }

    public void setSession(WebSocketSession session) {
        this.session = session;
    }


    public void sendJsonMessage(String string) {
        try {
           // Convert object to JSON string
            if (session != null && session.isOpen()) {
                session.sendMessage(new TextMessage(string)); // Send message to the frontend
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
