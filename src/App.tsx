import { useEffect, useState } from "react";
import { Home } from 'lucide-react';
import { useHeatingState } from './hooks/useHeatingState';
import { fetchWeatherDataJson } from './hooks/getWeatherData';
import { locationConfig } from './config/location';
import { ControlPanel } from './components/ControlPanel';
import { StatusIndicator } from './components/StatusIndicator';
import { TemperatureDisplay } from './components/TemperatureDisplay';
import { SensorPanel } from './components/SensorPanel';

function App() {
  const {
    sensors,
    isLoading,
    handleToggle,
    handleRefresh,
  } = useHeatingState();

  const [temperatureOutside, setTemperatureOutside] = useState<number | null>(null);
  const [lastUpdatedTemperatureOutside, setLastUpdatedTemperatureOutside] = useState<Date | null>(null);

  useEffect(() => {
    async function fetchOutsideTemperature() {
      try {
        const weatherData = await fetchWeatherDataJson(locationConfig.lat, locationConfig.long);

        const currentTemperature =
            weatherData.properties.timeseries[0]?.data.instant.details.air_temperature;

        if (currentTemperature !== undefined) {
          setTemperatureOutside(currentTemperature);
          setLastUpdatedTemperatureOutside(new Date());
        }
      } catch (error) {
        console.error('Failed to fetch outside temperature:', error);
      }
    }

    fetchOutsideTemperature();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Home className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold">Hyttestyring</h1>
        </div>

        <div className="space-y-6">
          <StatusIndicator 
            isHeatingOn={sensors.main.isHeatingOn}
            lastUpdated={sensors.main.lastUpdated}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(sensors).map(([sensorId, state]) => (
              <SensorPanel
                key={sensorId}
                sensorId={sensorId}
                temperature={state.temperature}
                isHeatingOn={state.isHeatingOn}
                isFrostProtectionOn={state.isFrostProtectionOn}
                lastUpdated={state.lastUpdated}
              />
            ))}
          </div>

          <TemperatureDisplay
            temperature={temperatureOutside}
            lastUpdated={lastUpdatedTemperatureOutside}
            locationText='Temperatur ute (met.no)'
          />
          
          <ControlPanel
            isHeatingOn={sensors.main.isHeatingOn}
            onToggle={handleToggle}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;