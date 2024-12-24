import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  isHeatingOn: boolean;
  lastUpdated: Date | null;
}

export const StatusIndicator: React.FC<Props> = ({ isHeatingOn, lastUpdated }) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-lg">
      <div className="flex items-center gap-2">
        {isHeatingOn ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <AlertCircle className="w-5 h-5 text-gray-400" />
        )}
        <span className="font-medium">
          Status: {isHeatingOn ? 'Varme på' : 'Varme av'}
        </span>
      </div>
      {lastUpdated && (
        <span className="text-sm text-gray-500">
          Oppdatert: {lastUpdated.toLocaleString()}
        </span>
      )}
    </div>
  );
};