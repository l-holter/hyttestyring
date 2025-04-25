import { useEffect, useState } from "react";
import { Home } from 'lucide-react';
import { pb, currentUser } from './lib/pocketbase';
import { useHeatingState } from './hooks/useHeatingState';
import { fetchWeatherDataJson } from './hooks/getWeatherData';
import { locationConfig } from './config/location';
import { ControlPanel } from './components/ControlPanel';
import { StatusIndicator } from './components/StatusIndicator';
import { TemperatureDisplay } from './components/TemperatureDisplay';
import { SensorPanel } from './components/SensorPanel';
import Login from './components/Login';
import { MessageHistory } from "./components/MessageHistory";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [temperatureOutside, setTemperatureOutside] = useState<number | null>(null);
  const [lastUpdatedTemperatureOutside, setLastUpdatedTemperatureOutside] = useState<Date | null>(null);

  const {
    sensors,
    isLoading,
    handleTurnOn,
    handleTurnOff,
    handleTemperatureControl,
    handleRefresh,
  } = useHeatingState();

  useEffect(() => {
    const unsubscribe = currentUser.subscribe((user) => {
      setIsAuthenticated(user !== null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchOutsideTemperature() {
      try {
        const weatherData = await fetchWeatherDataJson(locationConfig.lat, locationConfig.long);
        const currentTemperature = weatherData.properties.timeseries[0]?.data.instant.details.air_temperature;
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

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3">
              <Home className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold">Hyttestyring</h1>
            </div>
            <button
                onClick={() => pb.authStore.clear()}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Logg ut
            </button>
          </div>

          <div className="space-y-6">
            <StatusIndicator
                isHeatingOn={sensors.main.isHeatingOn}
                lastUpdated={sensors.main.lastUpdated}
            />

            <ControlPanel
                turnOff={handleTurnOff}
                turnOn={handleTurnOn}
                turnOnTemperatureControl={handleTemperatureControl}
                onRefresh={handleRefresh}
                isLoading={isLoading}
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

            <MessageHistory />
          </div>
        </div>
      </div>
  );
}

export default App;