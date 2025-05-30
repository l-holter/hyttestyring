import { useState, useEffect } from 'react';
import { sendSms } from '../utils/sms';
import { smsConfig } from '../config/sms';
import { pb, getCurrentUserId } from "../lib/pocketbase.ts";

interface HeatingState {
  id: string;
  temperature: number | null;
  isHeatingOn: boolean;
  isFrostProtectionOn: boolean;
  lastCommand: string;
  created: string;
  updated: string;
}

interface SensorState {
  temperature: number | null;
  isHeatingOn: boolean;
  isFrostProtectionOn: boolean;
  lastUpdated: Date | null;
}

const SENSOR_IDS = ['main', 'stua1', 'stua2', 'sov1'] as const;

export const useHeatingState = () => {
  const [sensors, setSensors] = useState<Record<string, SensorState>>({
    main: { temperature: null, isHeatingOn: false, isFrostProtectionOn: false, lastUpdated: null },
    stua1: { temperature: null, isHeatingOn: false, isFrostProtectionOn: false, lastUpdated: null },
    stua2: { temperature: null, isHeatingOn: false, isFrostProtectionOn: false, lastUpdated: null },
    sov1: { temperature: null, isHeatingOn: false, isFrostProtectionOn: false, lastUpdated: null }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    const fetchData = async () => {
      try {
        const promises = SENSOR_IDS.map(sensorId =>
          pb.collection('heating_state').getOne<HeatingState>(sensorId)
        );
        
        const records = await Promise.all(promises);
        
        if (!isMounted) return;

        records.forEach((record, index) => {
          const sensorId = SENSOR_IDS[index];
          setSensors(prev => ({
            ...prev,
            [sensorId]: {
              temperature: record.temperature,
              isHeatingOn: record.isHeatingOn,
              isFrostProtectionOn: record.isFrostProtectionOn,
              lastUpdated: new Date(record.updated)
            }
          }));
        });

        unsubscribe = await pb.collection('heating_state').subscribe('*', (e) => {
          if (!isMounted) return;
          
          if (e.action === 'update' && SENSOR_IDS.includes(e.record.id as typeof SENSOR_IDS[number])) {
            setSensors(prev => ({
              ...prev,
              [e.record.id]: {
                temperature: e.record.temperature,
                isHeatingOn: e.record.isHeatingOn,
                isFrostProtectionOn: e.record.isFrostProtectionOn,
                lastUpdated: new Date(e.record.updated)
              }
            }));
          }
        });

      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching sensor data:', error.message);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const saveSmsCommand = async (rawMessage: string) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        console.warn('No user logged in, SMS command will not be logged');
        return;
      }

      if (!pb.authStore.isValid) {
        console.error('Authentication is not valid, cannot log SMS command');
        return;
      }

      const data = {
        raw_message: rawMessage,
        user: userId,
      };

      await pb.collection('sent_messages').create(data);
      console.log('SMS command logged:', rawMessage);
    } catch (error) {
      console.error('Error logging SMS command:', error);
    }
  };

  const handleTurnOn = async () => {
    setIsLoading(true);
    try {
      await sendSms(smsConfig.commands.turnOn);
      await saveSmsCommand(smsConfig.commands.turnOn);
    } catch (error) {
      console.error('Error turning heating on:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTurnOff = async () => {
    setIsLoading(true);
    try {
      await sendSms(smsConfig.commands.turnOff);
      await saveSmsCommand(smsConfig.commands.turnOff);
    } catch (error) {
      console.error('Error turning heating off:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleTemperatureControl = async () => {
    setIsLoading(true);
    try {
      await sendSms(smsConfig.commands.temperatureControlStue);
      await saveSmsCommand(smsConfig.commands.temperatureControlStue);
      await delay(5000);
      await sendSms(smsConfig.commands.temperatureControlStue1);
      await saveSmsCommand(smsConfig.commands.temperatureControlStue1);
      await delay(5000);
      await sendSms(smsConfig.commands.temperatureControlStue2);
      await saveSmsCommand(smsConfig.commands.temperatureControlStue2);
      await delay(5000);
      await sendSms(smsConfig.commands.temperatureControlSov);
      await saveSmsCommand(smsConfig.commands.temperatureControlSov);
    } catch (error) {
      console.error('Error turning heating off:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await saveSmsCommand(smsConfig.commands.status);
      await sendSms(smsConfig.commands.status);
    } catch (error) {
      console.error('Error refreshing status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sensors,
    isLoading,
    handleTurnOn,
    handleTurnOff,
    handleTemperatureControl,
    handleRefresh
  };
};