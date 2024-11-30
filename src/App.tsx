import { TemperatureDisplay } from './components/TemperatureDisplay';
import { ControlPanel } from './components/ControlPanel';
import { StatusIndicator } from './components/StatusIndicator';
import { Home } from 'lucide-react';
import { useHeatingState } from './hooks/useHeatingState';

function App() {
  const {
    isHeatingOn,
    temperature,
    lastUpdated,
    isLoading,
    handleToggle,
    handleRefresh,
  } = useHeatingState();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Home className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold">Hyttestrying</h1>
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
        </div>
      </div>
    </div>
  );
}

export default App;