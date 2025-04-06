import React from "react";

interface CollateralProps {
  companyName: string;
  description: string;
  loanAmount: string;
  onSetCollateral?: () => void; // Optional callback for the "Set Collateral" button
}

const Collateral: React.FC<CollateralProps> = ({
  companyName,
  description,
  loanAmount,
  onSetCollateral,
}) => {
  return (
    <div className="bg-black border-neutral-">

    </div>
      
    // <div className="bg-black shadow-lg rounded-lg p-6 flex flex-col gap-4 border border-gray-700">
    //   <h2 className="text-2xl font-bold text-white">Company: {companyName}</h2>
    //   <p className="text-gray-300">{description}</p>
    //   <p className="text-lg font-medium text-white">
    //     Loan Amount: <span className="text-green-400">{loanAmount}</span>
    //   </p>
    //   <button
    //     onClick={onSetCollateral}
    //     className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition duration-300"
    //   >
    //     Set Collateral
    //   </button>
    // </div>
  );
};

export default Collateral;
