import { useState, useEffect } from 'react';
import { HeatingRecord, getLatestHeatingState, createHeatingState } from '../lib/pocketbase';
import { sendSMS } from '../utils/sms';
import { smsConfig } from '../config/sms';

export const useHeatingState = () => {
  const [isHeatingOn, setIsHeatingOn] = useState(false);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialState = async () => {
      const state = await getLatestHeatingState();
      if (state) {
        setIsHeatingOn(state.isHeatingOn);
        setTemperature(state.temperature);
        setLastUpdated(new Date(state.updated));
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
        temperature,
        lastCommand: command,
        lastCommandSuccess: true,
      });

      setIsHeatingOn(!isHeatingOn);
      setLastUpdated(new Date());
    } catch (error) {
      await createHeatingState({
        isHeatingOn,
        temperature,
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
        temperature: newTemp,
        lastCommand: smsConfig.commands.status,
        lastCommandSuccess: true,
      });

      setTemperature(newTemp);
      setLastUpdated(new Date());
    } catch (error) {
      await createHeatingState({
        isHeatingOn,
        temperature,
        lastCommand: smsConfig.commands.status,
        lastCommandSuccess: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isHeatingOn,
    temperature,
    lastUpdated,
    isLoading,
    handleToggle,
    handleRefresh,
  };
};