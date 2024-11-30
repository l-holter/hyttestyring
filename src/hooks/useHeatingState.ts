import { useState, useEffect } from 'react';
import { HeatingRecord, getLatestHeatingState, createHeatingState } from '../lib/pocketbase';
import { sendSMS } from '../utils/sms';
import { smsConfig } from '../config/sms';

export const useHeatingState = () => {
  const [isHeatingOn, setIsHeatingOn] = useState(false);
  const [temperatureInside, setTemperatureInside] = useState<number | null>(null);
  const [lastUpdatedInside, setLastUpdatedInside] = useState<Date | null>(null);
  const [temperatureOutside, setTemperatureOutside] = useState<number | null>(null);
  const [lastUpdatedTemperatureOutside, setLastUpdatedTemperatureOutside] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialState = async () => {
      const state = await getLatestHeatingState();
      if (state) {
        setIsHeatingOn(state.isHeatingOn);
        setTemperatureInside(state.temperatureInside);
        setLastUpdatedInside(new Date(state.updated));
      }
    };
    fetchInitialState();
  }, []);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const command = isHeatingOn ? smsConfig.commands.turnOff : smsConfig.commands.turnOn;
      await sendSMS(command, smsConfig.phoneNumber);
      
      await createHeatingState({
        isHeatingOn: !isHeatingOn,
        temperatureInside: temperatureInside,
        lastCommand: command,
        lastCommandSuccess: true,
      });

      setIsHeatingOn(!isHeatingOn);
      setLastUpdatedInside(new Date());
    } catch (error) {
      await createHeatingState({
        isHeatingOn,
        temperatureInside: temperatureInside,
        lastCommand: isHeatingOn ? smsConfig.commands.turnOff : smsConfig.commands.turnOn,
        lastCommandSuccess: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await sendSMS(smsConfig.commands.status, smsConfig.phoneNumber);
      const newTemp = Math.round(Math.random() * 10 + 15);
      
      await createHeatingState({
        isHeatingOn,
        temperatureInside: newTemp,
        lastCommand: smsConfig.commands.status,
        lastCommandSuccess: true,
      });

      setTemperatureInside(newTemp);
      setLastUpdatedInside(new Date());
    } catch (error) {
      await createHeatingState({
        isHeatingOn,
        temperatureInside: temperatureInside,
        lastCommand: smsConfig.commands.status,
        lastCommandSuccess: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isHeatingOn,
    temperatureInside: temperatureInside,
    lastUpdatedInside: lastUpdatedInside,
    temperatureOutside: temperatureOutside,
    lastUpdatedTemperatureOutside: lastUpdatedTemperatureOutside,
    isLoading,
    handleToggle,
    handleRefresh,
  };
};