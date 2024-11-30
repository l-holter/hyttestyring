export const sendSMS = async (command: string, phoneNumber: string) => {
  // In a real implementation, this would integrate with your SMS service
  // For demo purposes, we'll just log the command
  console.log(`Sending command ${command} to ${phoneNumber}`);
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
};