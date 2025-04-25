import { smsConfig } from '../config/sms';

export const sendSms = async (message: string): Promise<any> => {
  try {    
    const response = await fetch(`https://hyttestyring-sms-forwarder.holter.io/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${smsConfig.authToken}`
      },
      body: JSON.stringify({
        message
      }),
    });
    console.log(response)

    if (!response.ok) {
      throw new Error(`SMS API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('SMS API error:', error);
    throw error;
  }
};