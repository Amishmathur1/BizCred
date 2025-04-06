import DashboardHero from "~/components/DashboardHero";
import Sidebar from "~/components/Sidebar";
import Collateral from "~/components/CollateralCard";
import { useState } from "react";

function Collaterals() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartStreamlit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/start-streamlit');
      const data = await response.json();
      
      if (data.status === 'success') {
        console.log('Streamlit server started successfully');
        // The browser will be opened automatically by the backend
      } else if (data.status === 'already_running') {
        console.log('Streamlit server is already running');
        // Open the browser to the Streamlit app
        window.open('http://localhost:8501', '_blank');
      } else {
        setError(data.message || 'Failed to start Streamlit server');
      }
    } catch (err) {
      console.error('Error starting Streamlit server:', err);
      setError('Failed to connect to the Streamlit API. Make sure the API server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAnalyses = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/start-view-analyses');
      const data = await response.json();
      
      if (data.status === 'success') {
        console.log('View Analyses server started successfully');
        // The browser will be opened automatically by the backend
      } else if (data.status === 'already_running') {
        console.log('View Analyses server is already running');
        // Open the browser to the Streamlit app
        window.open('http://localhost:8502', '_blank');
      } else {
        setError(data.message || 'Failed to start View Analyses server');
      }
    } catch (err) {
      console.error('Error starting View Analyses server:', err);
      setError('Failed to connect to the API. Make sure the API server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen overflow-clip">
      <div className="flex items-start place-content-center justify-between gap-5 p-2">
        <Sidebar />
        <div className="flex flex-col gap-5 w-full">
          <DashboardHero />
          <div className="flex gap-4">
            <button 
              className="text-2xl font-medium bg-white text-black hover:scale-105 transition duration-300 w-40 h-12 rounded-xl"
              onClick={handleStartStreamlit}
              disabled={isLoading}
            >
              {isLoading ? 'Starting...' : 'Add loan'}
            </button>
            <button 
              className="text-2xl font-medium bg-blue-500 text-white hover:scale-105 transition duration-300 w-40 h-12 rounded-xl"
              onClick={handleViewAnalyses}
              disabled={isLoading}
            >
              {isLoading ? 'Starting...' : 'View All'}
            </button>
          </div>
          {error && (
            <div className="mt-2 text-red-500">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Collaterals;
