import { useEffect, useState } from "react";
import { useParams } from "@remix-run/react";
import DashboardHero from "~/components/DashboardHero";
import Sidebar from "~/components/Sidebar";
import SpotlightCard from "~/components/SpotlightCard";
import BarChart, { GraphData } from "~/components/BarChart";
import ReactMarkdown from "react-markdown";

interface Proposal {
  _id: string;
  proposal_title: string;
  company_description: string;
  risk_percentage: number;
  loan_amount: number;
  gemini_analysis: string;
  financial_metrics: {
    nav: number[];
    profit_loss: number[];
    cash_flow: number[];
  };
}

// Hardcoded proposal data
const HARDCODED_PROPOSALS: Record<string, Proposal> = {
  "dcd99de0-e89d-4f23-814e-c2bc35da267a": {
    _id: "dcd99de0-e89d-4f23-814e-c2bc35da267a",
    proposal_title: "Amish Bahi's Loan Proposal",
    company_description: "Professional business proposal for expansion",
    risk_percentage: 82.8,
    loan_amount: 50000,
    gemini_analysis: `# Financial Analysis of Amish Bahi's Loan Proposal

## Asset Valuation
- Current assets show a declining trend over the past 12 months
- Net Asset Value (NAV) has decreased by 15% year-over-year
- Asset quality is questionable with high volatility in valuations

## Cash Management
- Cash flow is inconsistent with multiple negative months
- Working capital appears insufficient for current operations
- High dependency on short-term financing

## Risk Assessment
- Overall risk score: 82.8% (High Risk)
- Multiple red flags in financial statements
- Unprofessional communication in proposal
- Zero-value loan request is concerning

## Recommendation
**REJECT** this loan proposal due to:
1. High risk score exceeding acceptable threshold
2. Declining asset values
3. Inconsistent cash flow
4. Unprofessional business practices
5. Zero-value loan request indicating potential fraud`,
    financial_metrics: {
      nav: [100000, 95000, 92000, 90000, 88000, 85000, 82000, 80000, 78000, 75000, 72000, 70000],
      profit_loss: [10000, 8000, 6000, 4000, 2000, 0, -2000, -4000, -6000, -8000, -10000, -12000],
      cash_flow: [5000, 3000, 1000, -1000, -3000, -5000, -7000, -9000, -11000, -13000, -15000, -17000]
    }
  },
  "default": {
    _id: "default",
    proposal_title: "Sample Loan Proposal",
    company_description: "A professional business proposal for expansion",
    risk_percentage: 45.5,
    loan_amount: 75000,
    gemini_analysis: `# Financial Analysis of Sample Loan Proposal

## Asset Valuation
- Current assets show a stable trend over the past 12 months
- Net Asset Value (NAV) has increased by 5% year-over-year
- Asset quality is good with consistent valuations

## Cash Management
- Cash flow is positive with occasional fluctuations
- Working capital is sufficient for current operations
- Low dependency on short-term financing

## Risk Assessment
- Overall risk score: 45.5% (Moderate Risk)
- Financial statements show healthy growth
- Professional communication in proposal
- Reasonable loan request with clear purpose

## Recommendation
**APPROVE** this loan proposal due to:
1. Moderate risk score within acceptable range
2. Stable asset values
3. Positive cash flow
4. Professional business practices
5. Clear loan purpose with reasonable amount`,
    financial_metrics: {
      nav: [100000, 102000, 104000, 106000, 108000, 110000, 112000, 114000, 116000, 118000, 120000, 122000],
      profit_loss: [10000, 12000, 14000, 16000, 18000, 20000, 22000, 24000, 26000, 28000, 30000, 32000],
      cash_flow: [5000, 7000, 9000, 11000, 13000, 15000, 17000, 19000, 21000, 23000, 25000, 27000]
    }
  }
};

function ProposalDetail() {
  const { id } = useParams();
  console.log("Component mounted with ID:", id);
  
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentGraphIndex, setCurrentGraphIndex] = useState(0);

  // Graph data for the carousel
  const [graphs, setGraphs] = useState<GraphData[]>([]);

  useEffect(() => {
    console.log("useEffect triggered with ID:", id);
    
    // Use hardcoded data instead of API call
    try {
      setLoading(true);
      console.log(`Loading proposal with ID: ${id}`);
      
      // Get the proposal from hardcoded data or use default
      const proposalData = id && HARDCODED_PROPOSALS[id] 
        ? HARDCODED_PROPOSALS[id] 
        : HARDCODED_PROPOSALS.default;
      
      console.log('Loaded proposal data:', proposalData);
      setProposal(proposalData);
      
      // Prepare graph data from financial metrics
      if (proposalData.financial_metrics) {
        console.log('Financial metrics:', proposalData.financial_metrics);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Create graph data for NAV
        const navGraph: GraphData = {
          title: "Net Asset Value (NAV)",
          xData: months,
          yData: proposalData.financial_metrics.nav?.slice(0, 12) || Array(12).fill(0),
          color: "#4CAF50",
        };
        
        // Create graph data for Profit/Loss
        const profitLossGraph: GraphData = {
          title: "Profit/Loss",
          xData: months,
          yData: proposalData.financial_metrics.profit_loss?.slice(0, 12) || Array(12).fill(0),
          color: "#FF5722",
        };
        
        // Create graph data for Cash Flow
        const cashFlowGraph: GraphData = {
          title: "Cash Flow",
          xData: months,
          yData: proposalData.financial_metrics.cash_flow?.slice(0, 12) || Array(12).fill(0),
          color: "#2196F3",
        };
        
        setGraphs([navGraph, profitLossGraph, cashFlowGraph]);
      } else {
        console.log('No financial metrics found');
        // If no financial metrics, create empty graphs
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const emptyGraph: GraphData = {
          title: "No Financial Data Available",
          xData: months,
          yData: Array(12).fill(0),
          color: "#9E9E9E",
        };
        setGraphs([emptyGraph, emptyGraph, emptyGraph]);
      }
    } catch (err) {
      console.error('Error loading proposal:', err);
      setError('Failed to load proposal data.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Handlers for navigating the carousel
  const handleGraphSelect = (index: number) => {
    setCurrentGraphIndex(index);
  };

  console.log("Rendering component with state:", { loading, error, proposal: proposal ? 'exists' : 'null' });

  return (
    <div className="w-screen overflow-clip">
      <div className="flex items-start justify-between gap-5 p-2">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex flex-col gap-5 w-full">
          {/* Hero Section */}
          <DashboardHero />

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900 text-white p-4 rounded-lg">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
            </div>
          ) : !proposal ? (
            <div className="bg-neutral-800 text-white p-4 rounded-lg">
              <p>Proposal not found.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center h-[35rem] overflow-y-scroll">
              <div className="flex flex-col items-center w-full">
                {/* Spotlight Card with Gemini Analysis */}
                <SpotlightCard className="h-[15rem] w-full mb-5 overflow-y-scroll">
                  <div className="flex flex-col h-auto">
                    <strong className="text-2xl">{proposal.proposal_title}</strong>
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown>{proposal.gemini_analysis}</ReactMarkdown>
                    </div>
                  </div>
                </SpotlightCard>

                {/* Bar Chart and Controls */}
                <div className="flex flex-col items-center w-full">
                  <div className="flex justify-between items-center w-full">
                    {/* Bar Chart */}
                    {graphs.length > 0 && <BarChart {...graphs[currentGraphIndex]} />}
                    {/* Graph Selection Buttons */}
                    <div className="flex flex-col gap-4 mt-4 w-[10%]">
                      {graphs.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handleGraphSelect(index)}
                          className={`px-4 py-2 rounded-lg ${
                            currentGraphIndex === index
                              ? "bg-blue-600 text-white"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          } transition`}
                        >
                          {index === 0 ? "NAV" : index === 1 ? "Profit/Loss" : "Cash Flow"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProposalDetail; 