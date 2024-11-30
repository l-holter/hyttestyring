import React from 'react';
import { Thermometer } from 'lucide-react';

interface Props {
  temperature: number | null;
  lastUpdated: Date | null;
}

export const TemperatureDisplay: React.FC<Props> = ({ temperature, lastUpdated }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <Thermometer className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold">Current Temperature</h2>
      </div>
      
      <div className="text-4xl font-bold text-center mb-2">
        {temperature !== null ? `${temperature}°C` : '--°C'}
      </div>
      
      {lastUpdated && (
        <p className="text-sm text-gray-500 text-center">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};