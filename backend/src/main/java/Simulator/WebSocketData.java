package Simulator;

public class WebSocketData {
    private String MachineId;
    private String PrevQueueId;
    private String NextQueueId;
    private String Color;
    public void setWebSocketData(String MachineId, String PrevQueueId, String NextQueueId, String Color) {
        this.MachineId = MachineId;
        this.PrevQueueId = PrevQueueId;
        this.NextQueueId = NextQueueId;
        this.Color = Color;
    }
    public String getMachineId() {return MachineId;}
    public String getPrevQueueId() {return PrevQueueId;}
    public String getNextQueueId() {return NextQueueId;}
    public String getColor() {return Color;}
    public void setMachineId(String MachineId) {this.MachineId = MachineId;}
    public void setPrevQueueId(String PrevQueueId) {this.PrevQueueId = PrevQueueId;}
    public void setNextQueueId(String NextQueueId) {this.NextQueueId = NextQueueId;}
    public void setColor(String Color) {this.Color = Color;}

}
