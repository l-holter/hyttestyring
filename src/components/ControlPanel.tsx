import React from 'react';
import { Power, RefreshCw } from 'lucide-react';
import { smsConfig } from '../config/sms';
import { sendSMS } from '../utils/sms';

interface Props {
  isHeatingOn: boolean;
  onToggle: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const ControlPanel: React.FC<Props> = ({ isHeatingOn, onToggle, onRefresh, isLoading }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Heating Control</h2>
      
      <div className="flex gap-4">
        <button
          onClick={onToggle}
          disabled={isLoading}
          className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center gap-2 ${
            isHeatingOn
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          } disabled:opacity-50 transition-colors`}
        >
          <Power className="w-5 h-5" />
          {isHeatingOn ? 'Turn Off' : 'Turn On'}
        </button>
        
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="py-3 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};