import React, { useState, useCallback } from 'react';
import { TemperatureDisplay } from './components/TemperatureDisplay';
import { ControlPanel } from './components/ControlPanel';
import { StatusIndicator } from './components/StatusIndicator';
import { CommandHistory } from './components/CommandHistory';
import { smsConfig } from './config/sms';
import { sendSMS } from './utils/sms';
import { Home } from 'lucide-react';
import { CommandHistoryEntry } from './types/controller';

function App() {
  const [isHeatingOn, setIsHeatingOn] = useState(false);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [commandHistory, setCommandHistory] = useState<CommandHistoryEntry[]>([]);

  const addToHistory = (command: string, success: boolean) => {
    setCommandHistory(prev => [
      ...prev,
      { command, timestamp: new Date(), success }
    ]);
  };

  const handleToggle = useCallback(async () => {
    setIsLoading(true);
    try {
      const command = isHeatingOn ? smsConfig.commands.turnOff : smsConfig.commands.turnOn;
      await sendSMS(command, smsConfig.phoneNumber);
      setIsHeatingOn(!isHeatingOn);
      setLastUpdated(new Date());
      addToHistory(command, true);
    } catch (error) {
      addToHistory(isHeatingOn ? smsConfig.commands.turnOff : smsConfig.commands.turnOn, false);
    } finally {
      setIsLoading(false);
    }
  }, [isHeatingOn]);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await sendSMS(smsConfig.commands.status, smsConfig.phoneNumber);
      setTemperature(Math.round(Math.random() * 10 + 15));
      setLastUpdated(new Date());
      addToHistory(smsConfig.commands.status, true);
    } catch (error) {
      addToHistory(smsConfig.commands.status, false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Home className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold">Cabin Control</h1>
        </div>

        <div className="space-y-6">
          <StatusIndicator 
            isHeatingOn={isHeatingOn}
            lastUpdated={lastUpdated}
          />

          <TemperatureDisplay 
            temperature={temperature}
            lastUpdated={lastUpdated}
          />
          
          <ControlPanel
            isHeatingOn={isHeatingOn}
            onToggle={handleToggle}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />

          <CommandHistory history={commandHistory} />

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Instructions</h2>
            <p className="text-gray-600 text-sm">
              Control your cabin's heating system remotely. The system uses SMS commands
              to communicate with your Ontario 4G controller. Temperature updates may take
              a few moments to reflect after sending commands.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;