export const sendSMS = async (command: string): Promise<any> => {
  try {
    const response = await fetch('http://localhost:3037', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('SMS API error:', error);
    throw error;
  }
};