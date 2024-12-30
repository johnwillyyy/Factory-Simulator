export const sendMachineToBackend = async (machineData) => {
  try {
      const response = await fetch('http://localhost:8080/createMachine', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(machineData),
      });
      if (!response.ok) {
          throw new Error(`Failed to send machine data: ${response.statusText}`);
      }
      const data = await response.json(); // Parse the response as JSON
      console.log('Updated Machine List:', data); // Print the updated list to the console
      return data; // Return the updated list
  } catch (error) {
      console.error('Error sending machine data to backend:', error);
      return null;
  }
};

export const sendQueueToBackend = async (queueData) => {
  try {
      const response = await fetch('http://localhost:8080/createQueue', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(queueData),
      });
      if (!response.ok) {
          throw new Error(`Failed to send queue data: ${response.statusText}`);
      }
      const data = await response.json(); // Parse the response as JSON
      console.log('Updated Queue List:', data); // Print the updated list to the console
      return data; // Return the updated list
  } catch (error) {
      console.error('Error sending queue data to backend:', error);
      return null;
  }
};


export const sendNodeChangeToBackend = async (node) => {
  try {
    const response = await fetch("http://localhost:8080/nodeChange", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(node), // Send the moved node data
    });

    if (!response.ok) {
      throw new Error(`Failed to update node position: ${response.statusText}`);
    }

    const data = await response.json(); // Parse updated node list from response
    console.log("Updated node list from backend:", data);
    return data;
  } catch (error) {
    console.error("Error updating node position on backend:", error);
    return null;
  }
};

