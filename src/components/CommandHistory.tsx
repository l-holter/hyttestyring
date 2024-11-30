import React from 'react';
import { History } from 'lucide-react';
import { CommandHistoryEntry } from '../types/controller';

interface Props {
  history: CommandHistoryEntry[];
}

export const CommandHistory: React.FC<Props> = ({ history }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-semibold">Command History</h2>
      </div>
      
      <div className="space-y-2">
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm">No commands sent yet</p>
        ) : (
          history.slice(-5).map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm border-b border-gray-100 py-2"
            >
              <span className="font-medium">{entry.command}</span>
              <div className="flex items-center gap-4">
                <span className={entry.success ? 'text-green-500' : 'text-red-500'}>
                  {entry.success ? 'Success' : 'Failed'}
                </span>
                <span className="text-gray-500">
                  {entry.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};