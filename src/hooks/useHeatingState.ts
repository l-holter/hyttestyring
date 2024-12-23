import { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import { sendSMS } from '../utils/sms';
import { smsConfig } from '../config/sms';

export const pb = new PocketBase('http://localhost:8095');

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

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const command = sensors.main.isHeatingOn ? smsConfig.commands.turnOff : smsConfig.commands.turnOn;
      await sendSMS(command);
    } catch (error) {
      console.error('Error toggling heating:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await sendSMS(smsConfig.commands.status);
    } catch (error) {
      console.error('Error refreshing status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sensors,
    isLoading,
    handleToggle,
    handleRefresh
  };
};