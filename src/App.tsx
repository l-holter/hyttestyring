import {useEffect, useState} from "react";
import { TemperatureDisplay } from './components/TemperatureDisplay.tsx';
import { ControlPanel } from './components/ControlPanel';
import { StatusIndicator } from './components/StatusIndicator';
import { Home } from 'lucide-react';
import { useHeatingState } from './hooks/useHeatingState';
import { fetchWeatherDataJson } from './hooks/getWeatherData.ts';
import { locationConfig } from './config/location.ts'



function App() {
  const {
    isHeatingOn,
    temperatureInside,
    lastUpdatedInside,
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

        // Extract the current temperature from the weather data
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
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Home className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold">Hyttestyring</h1>
        </div>

        <div className="space-y-6">
          <StatusIndicator 
            isHeatingOn={isHeatingOn}
            lastUpdated={lastUpdatedInside}
          />

          <TemperatureDisplay
            temperature={temperatureInside}
            lastUpdated={lastUpdatedInside}
            locationText='Temperatur inne'
          />

          <TemperatureDisplay
              temperature={temperatureOutside}
              lastUpdated={lastUpdatedTemperatureOutside}
              locationText='Temperatur ute'
          />
          
          <ControlPanel
            isHeatingOn={isHeatingOn}
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