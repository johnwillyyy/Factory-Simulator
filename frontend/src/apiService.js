// Function to send machine data to the backend
export const sendMachineToBackend = async (machineData) => {
    try {
      const response = await fetch('/api/machines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(machineData),
      });
      if (!response.ok) {
        throw new Error(`Failed to send machine data: ${response.statusText}`);
      }
      console.log('Machine data successfully sent to backend:', machineData);
    } catch (error) {
      console.error('Error sending machine data to backend:', error);
    }
  };
  
  // Function to send queue data to the backend
  export const sendQueueToBackend = async (queueData) => {
    try {
      const response = await fetch('/api/queues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queueData),
      });
      if (!response.ok) {
        throw new Error(`Failed to send queue data: ${response.statusText}`);
      }
      console.log('Queue data successfully sent to backend:', queueData);
    } catch (error) {
      console.error('Error sending queue data to backend:', error);
    }
  };
  