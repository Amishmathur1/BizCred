import { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import DashboardHero from "~/components/DashboardHero";
import Sidebar from "~/components/Sidebar";
import SpotlightCard from "~/components/SpotlightCard";
import BarChart from "~/components/BarChart";
import ReactMarkdown from "react-markdown";

interface Proposal {
  _id: string;
  proposal_title: string;
  company_description: string;
  risk_percentage: number;
  loan_amount: number;
  blockchain_address?: string;
  name?: string;
  gemini_analysis?: string;
  financial_metrics?: {
    nav: number[];
    profit_loss: number[];
    cash_flow: number[];
  };
}

export async function loader() {
  try {
    const response = await fetch("http://localhost:5000/api/proposals");
    const data = await response.json();
    
    if (data.status === "success") {
      // Get the latest 3 proposals
      const latestProposals = data.proposals.slice(0, 3);
      
      // Filter for low-risk proposals (risk < 50)
      const lowRiskProposals = latestProposals.filter(
        (p: Proposal) => p.risk_percentage < 50
      );
      
      // Get the first low-risk proposal
      const proposal = lowRiskProposals[0] || null;
      
      // Log the proposal data for debugging
      console.log("Loaded proposal:", proposal);
      
      return { proposal };
    } else {
      console.error("Failed to fetch proposals:", data.message);
      return { proposal: null };
    }
  } catch (error) {
    console.error("Error loading proposals:", error);
    return { proposal: null };
  }
}

export default function Proposal1() {
  const { proposal } = useLoaderData<{ proposal: Proposal | null }>();
  const [loading, setLoading] = useState(true);
  const [graphs, setGraphs] = useState<{
    nav: { xData: string[]; yData: number[] };
    profitLoss: { xData: string[]; yData: number[] };
    cashFlow: { xData: string[]; yData: number[] };
  }>({
    nav: { xData: [], yData: [] },
    profitLoss: { xData: [], yData: [] },
    cashFlow: { xData: [], yData: [] }
  });

  useEffect(() => {
    if (proposal?.financial_metrics) {
      console.log("Setting up graphs with metrics:", proposal.financial_metrics);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      // Ensure we have arrays and they have values
      const navData = Array.isArray(proposal.financial_metrics.nav) ? proposal.financial_metrics.nav : [];
      const profitLossData = Array.isArray(proposal.financial_metrics.profit_loss) ? proposal.financial_metrics.profit_loss : [];
      const cashFlowData = Array.isArray(proposal.financial_metrics.cash_flow) ? proposal.financial_metrics.cash_flow : [];
      
      setGraphs({
        nav: {
          xData: months.slice(0, Math.min(12, navData.length)),
          yData: navData.slice(0, 12)
        },
        profitLoss: {
          xData: months.slice(0, Math.min(12, profitLossData.length)),
          yData: profitLossData.slice(0, 12)
        },
        cashFlow: {
          xData: months.slice(0, Math.min(12, cashFlowData.length)),
          yData: cashFlowData.slice(0, 12)
        }
      });
    }
    setLoading(false);
  }, [proposal]);

  const getRiskColor = (risk: number) => {
    if (risk < 50) return "text-green-500";
    if (risk < 75) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="w-screen overflow-clip">
      <div className="flex items-start place-content-center justify-between gap-5 p-2">
        <Sidebar />
        <div className="flex flex-col gap-5 w-full">
          <DashboardHero />
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : !proposal ? (
            <div className="bg-red-900 text-white p-4 rounded-lg">
              <p className="font-bold">No low-risk proposals available</p>
              <p>Please check back later or contact support if this persists.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 p-4">
              <SpotlightCard className="p-6">
                <h2 className="text-2xl font-bold mb-4">{proposal.proposal_title}</h2>
                <p className="text-gray-300 mb-4">{proposal.company_description}</p>
                <div className="flex justify-between mb-4">
                  <div>
                    <span className="text-gray-400">Risk:</span>
                    <span className={`ml-2 ${getRiskColor(proposal.risk_percentage)}`}>
                      {proposal.risk_percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Loan Amount:</span>
                    <span className="ml-2">{proposal.loan_amount.toLocaleString()} ETH</span>
                  </div>
                </div>
                {proposal.gemini_analysis && (
                  <div className="prose prose-invert max-w-none mt-6">
                    <ReactMarkdown>{proposal.gemini_analysis}</ReactMarkdown>
                  </div>
                )}
              </SpotlightCard>
              
              {proposal.financial_metrics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {graphs.nav.yData.length > 0 && (
                    <BarChart
                      title="NAV"
                      xData={graphs.nav.xData}
                      yData={graphs.nav.yData}
                      color="rgba(34, 197, 94, 0.5)"
                    />
                  )}
                  {graphs.profitLoss.yData.length > 0 && (
                    <BarChart
                      title="Profit/Loss"
                      xData={graphs.profitLoss.xData}
                      yData={graphs.profitLoss.yData}
                      color="rgba(59, 130, 246, 0.5)"
                    />
                  )}
                  {graphs.cashFlow.yData.length > 0 && (
                    <BarChart
                      title="Cash Flow"
                      xData={graphs.cashFlow.xData}
                      yData={graphs.cashFlow.yData}
                      color="rgba(168, 85, 247, 0.5)"
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 