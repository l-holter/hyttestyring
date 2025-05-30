import React from 'react';
import { Power, RefreshCw, Thermometer } from 'lucide-react';

interface Props {
  turnOff: () => void;
  turnOn: () => void;
  turnOnTemperatureControl: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const ControlPanel: React.FC<Props> = ({ turnOff, turnOn, turnOnTemperatureControl, onRefresh, isLoading }) => {
  return (
      <div className="w-full bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Temperaturkontroll</h2>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
              onClick={turnOn}
              disabled={isLoading}
              className="w-full py-3 px-6 rounded-lg flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 transition-colors"
          >
            <Power className="w-5 h-5"/>
            Skru på
          </button>

          <button
              onClick={turnOff}
              disabled={isLoading}
              className="w-full py-3 px-6 rounded-lg flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 transition-colors"
          >
            <Power className="w-5 h-5"/>
            Skru av
          </button>

          <button
              onClick={turnOnTemperatureControl}
              disabled={isLoading}
              className="w-full py-3 px-6 rounded-lg flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 transition-colors"
          >
            <Thermometer className="w-5 h-5"/>
            Frostbeskyttelse
          </button>

          <button
              onClick={onRefresh}
              disabled={isLoading}
              className="w-full py-3 px-6 rounded-lg flex items-center justify-center gap-2 self-center bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}/>
            Status
          </button>
        </div>
      </div>
  );
};