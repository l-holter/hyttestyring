interface SensorPanelProps {
  sensorId: string;
  temperature: number | null;
  isHeatingOn: boolean;
  isFrostProtectionOn: boolean;
  lastUpdated: Date | null;
}

export const SensorPanel: React.FC<SensorPanelProps> = ({
  sensorId,
  temperature,
  isHeatingOn,
  isFrostProtectionOn,
  lastUpdated
}) => {
  const displayName = {
    'main': 'Hovedsensor',
    'stua1': 'Stue 1',
    'stua2': 'Stue 2',
    'sov1': 'Soverom 1'
  }[sensorId];

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">{displayName}</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Temperatur:</span>
          <span className="font-medium">{temperature !== null ? `${temperature}°C` : '--°C'}</span>
        </div>
        <div className="flex justify-between">
          <span>Varme:</span>
          <span className={`font-medium ${isHeatingOn ? 'text-green-500' : 'text-gray-500'}`}>
            {isHeatingOn ? 'På' : 'Av'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Frostbeskyttelse:</span>
          <span className={`font-medium ${isFrostProtectionOn ? 'text-blue-500' : 'text-gray-500'}`}>
            {isFrostProtectionOn ? 'På' : 'Av'}
          </span>
        </div>
        {lastUpdated && (
          <div className="text-sm text-gray-500 text-right mt-4">
            Oppdatert: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};