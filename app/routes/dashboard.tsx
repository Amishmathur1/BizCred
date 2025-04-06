import { useState } from "react";
import DashboardHero from "~/components/DashboardHero";
import Sidebar from "~/components/Sidebar";
import ProposalCard from "~/components/ProposalCard";
import { useLoaderData } from "@remix-run/react";

interface Proposal {
  _id: string;
  proposal_title: string;
  company_description: string;
  risk_percentage: number;
  loan_amount: number;
  name: string;
}

interface ApiResponse {
  status: string;
  proposals: Proposal[];
}

export async function loader() {
  try {
    const response = await fetch('http://localhost:5000/api/proposals');
    if (!response.ok) {
      throw new Error('Failed to fetch proposals');
    }
    
    const data: ApiResponse = await response.json();
    
    if (data.status !== "success") {
      console.error("API returned error status:", data.status);
      return { proposals: [] };
    }
    
    // Sort proposals by _id in descending order (assuming _id contains timestamp)
    const sortedProposals = data.proposals.sort((a, b) => b._id.localeCompare(a._id));
    
    // Get the latest three proposals and ensure all required fields are present
    const latestProposals = sortedProposals.slice(0, 3).map(proposal => ({
      _id: proposal._id,
      proposal_title: proposal.proposal_title || 'Untitled Proposal',
      company_description: proposal.company_description || 'No description available',
      risk_percentage: typeof proposal.risk_percentage === 'number' ? proposal.risk_percentage : 0,
      loan_amount: typeof proposal.loan_amount === 'number' ? proposal.loan_amount : 0,
      name: proposal.name || 'Unnamed Company'
    }));
    
    console.log("Fetched proposals:", latestProposals);
    return { proposals: latestProposals };
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return { proposals: [] };
  }
}

export default function Dashboard() {
  const { proposals } = useLoaderData<{ proposals: Proposal[] }>();
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
    
      };

  return (
    <div className="w-screen overflow-clip">
      <div className="flex items-start place-content-center justify-between gap-5 p-2">
        <Sidebar />
        <div className="flex flex-col gap-5 w-full">
          <DashboardHero />
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Proposals</h2>
            <div className="flex gap-4">
              <button 
                className="text-lg font-medium bg-white text-black hover:scale-105 transition duration-300 w-40 h-12 rounded-xl"
                onClick={handleStartStreamlit}
                disabled={isLoading}
              >
                {isLoading ? 'Starting...' : 'View Data'}
              </button>
              <button 
                className="text-lg font-medium bg-blue-500 text-white hover:scale-105 transition duration-300 w-40 h-12 rounded-xl"
                onClick={handleViewAnalyses}
                disabled={isLoading}
              >
                {isLoading ? 'Starting...' : 'Add Loan'}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-900 text-white p-4 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          {!proposals || proposals.length === 0 ? (
            <div className="bg-red-900 text-white p-4 rounded-lg">
              <p className="font-bold">No proposals available</p>
              <p>Please check back later or contact support if this persists.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {proposals.map((proposal) => (
                <ProposalCard
                  key={proposal._id}
                  title={proposal.proposal_title}
                  description={proposal.company_description}
                  riskPercentage={proposal.risk_percentage}
                  loanAmount={proposal.loan_amount}
                  name={proposal.name}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}