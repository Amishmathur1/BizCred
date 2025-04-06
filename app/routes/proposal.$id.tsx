import { useEffect, useState } from "react";
import { useLoaderData, useParams } from "@remix-run/react";
import DashboardHero from "~/components/DashboardHero";
import Sidebar from "~/components/Sidebar";
import SpotlightCard from "~/components/SpotlightCard";
import BarChart from "~/components/BarChart";

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

interface LoaderParams {
  params: {
    id: string;
  };
}

export async function loader({ params }: LoaderParams) {
  try {
    const response = await fetch("http://localhost:5000/api/proposals");
    const data = await response.json();
    
    if (data.status === "success") {
      // Find the proposal with the matching ID
      const proposal = data.proposals.find((p: Proposal) => p._id === params.id);
      
      if (proposal) {
        return { proposal };
      } else {
        console.error("Proposal not found:", params.id);
        return { proposal: null };
      }
    } else {
      console.error("Failed to fetch proposals:", data.message);
      return { proposal: null };
    }
  } catch (error) {
    console.error("Error loading proposal:", error);
    return { proposal: null };
  }
}

export default function ProposalDetail() {
  const { proposal } = useLoaderData<{ proposal: Proposal | null }>();
  const [loading, setLoading] = useState(false);
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
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      setGraphs({
        nav: {
          xData: months,
          yData: proposal.financial_metrics.nav.slice(0, 12)
        },
        profitLoss: {
          xData: months,
          yData: proposal.financial_metrics.profit_loss.slice(0, 12)
        },
        cashFlow: {
          xData: months,
          yData: proposal.financial_metrics.cash_flow.slice(0, 12)
        }
      });
    }
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
              <p className="font-bold">Proposal not found</p>
              <p>Please check the URL or return to the proposals page.</p>
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
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: proposal.gemini_analysis || "No analysis available" }} />
                </div>
              </SpotlightCard>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BarChart
                  title="NAV"
                  xData={graphs.nav.xData}
                  yData={graphs.nav.yData}
                  color="rgba(34, 197, 94, 0.5)"
                />
                <BarChart
                  title="Profit/Loss"
                  xData={graphs.profitLoss.xData}
                  yData={graphs.profitLoss.yData}
                  color="rgba(59, 130, 246, 0.5)"
                />
                <BarChart
                  title="Cash Flow"
                  xData={graphs.cashFlow.xData}
                  yData={graphs.cashFlow.yData}
                  color="rgba(168, 85, 247, 0.5)"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 