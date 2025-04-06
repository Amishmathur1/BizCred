import React from 'react';
import SpotlightCard from './SpotlightCard';

interface ProposalCardProps {
  title: string;
  description: string;
  riskPercentage: number;
  loanAmount: number;
  name: string;
}

const ProposalCard: React.FC<ProposalCardProps> = ({
  title,
  description,
  riskPercentage,
  loanAmount,
  name,
}) => {
  const getRiskColor = (risk: number) => {
    if (risk < 50) return 'text-green-500';
    if (risk < 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatLoanAmount = (amount: number | undefined): string => {
    if (amount === undefined || amount === null) return '0 ETH';
    return `${amount.toLocaleString()} ETH`;
  };

  const formatRiskPercentage = (risk: number | undefined): string => {
    if (risk === undefined || risk === null) return '0%';
    return `${risk.toFixed(1)}%`;
  };

  const getStreamlitUrl = () => {
    const baseUrl = 'http://localhost:8502';
    const encodedName = encodeURIComponent(name);
    return `${baseUrl}?company=${encodedName}`;
  };

  return (
    <SpotlightCard className="h-auto" spotlightColor="rgba(255, 255, 255, 0.25)">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-2">{title || "Untitled Proposal"}</h3>
        <p className="text-gray-300 mb-4">{description || "No description available"}</p>
        <div className="flex justify-between mb-2">
          <span>Risk:</span>
          <span className={getRiskColor(riskPercentage || 0)}>
            {formatRiskPercentage(riskPercentage)}
          </span>
        </div>
        <div className="flex justify-between mb-4">
          <span>Loan Amount:</span>
          <span>{formatLoanAmount(loanAmount)}</span>
        </div>
      </div>
    </SpotlightCard>
  );
};

export default ProposalCard;
