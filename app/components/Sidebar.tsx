import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCompass,
  FaMoneyCheckAlt,
  FaChartBar,
  FaWallet,
} from "react-icons/fa";

const Sidebar: React.FC = () => {
  const [balance, setBalance] = useState("1000.00");
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  
  // Check if MetaMask is installed
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        console.log("Make sure you have MetaMask installed!");
        return;
      }
      
      // Check if we're authorized to access the user's wallet
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        setWalletAddress(account);
        setIsConnected(true);
        
        // Fetch wallet balance
        const balance = await ethereum.request({
          method: "eth_getBalance",
          params: [account, "latest"],
        });
        
        // Convert balance from wei to ETH
        const ethBalance = parseInt(balance, 16) / 10**18;
        setBalance(ethBalance.toFixed(4));
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  // Connect wallet function
  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      
      // Request account access
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      
      setWalletAddress(accounts[0]);
      setIsConnected(true);
      
      // Fetch wallet balance
      const balance = await ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });
      
      // Convert balance from wei to ETH
      const ethBalance = parseInt(balance, 16) / 10**18;
      setBalance(ethBalance.toFixed(4));
      
    } catch (error) {
      console.error(error);
    }
  };
  
  // Use effect to check wallet connection on component mount
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  
  // Format the wallet address for display
  const formatAddress = (address: string) => {
    return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : "";
  };

  return (
    <div className="w-[20%] h-screen bg-white border border-black text-black flex flex-col p-4 rounded-xl">
      <div className="text-2xl font-bold flex items-center mb-6">
        <span role="img" aria-label="wallet" className="mr-2"></span>
        BizCred
      </div>
      
      {/* Wallet Connection Button */}
      <div className="mb-6">
        {isConnected ? (
          <div className="bg-green-100 p-3 rounded-lg">
            <div className="font-medium text-green-700 flex items-center">
              <FaWallet className="mr-2" />
              <span>{formatAddress(walletAddress)}</span>
            </div>
            <div className="text-sm text-green-600 mt-1">Connected</div>
          </div>
        ) : (
          <button 
            onClick={connectWallet}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition duration-300"
          >
            <FaWallet className="mr-2" />
            Connect MetaMask
          </button>
        )}
      </div>
      
      <ul className="space-y-6">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition duration-300 ${
                isActive
                  ? "bg-[#3A29FF80] text-white"
                  : "text-black hover:text-white hover:bg-[#3A29FF80]"
              }`
            }
          >
            <FaTachometerAlt className="mr-3" />
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/my-loans"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition duration-300 ${
                isActive
                  ? "bg-[#3A29FF80] text-white"
                  : "text-black hover:text-white hover:bg-[#3A29FF80]"
              }`
            }
          >
            <FaCompass className="mr-3" />
            My Loans
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/collaterals"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition duration-300 ${
                isActive
                  ? "bg-[#3A29FF80] text-white"
                  : "text-black hover:text-white hover:bg-[#3A29FF80]"
              }`
            }
          >
            <FaMoneyCheckAlt className="mr-3" />
            Collaterals
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/proposal"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition duration-300 ${
                isActive
                  ? "bg-[#3A29FF80] text-white"
                  : "text-black hover:text-white hover:bg-[#3A29FF80]"
              }`
            }
          >
            <FaChartBar className="mr-3" />
            My Proposals
          </NavLink>
        </li>
      </ul>
      
      <div className="mt-auto">
        <div className="w-full bg-gradient-to-r from-[#281f9f8a] via-[#dc3e3e8c] to-[#e0285f8b] rounded-2xl p-4">
          <h1 className="text-xl text-black font-medium">Balance</h1>
          <p className="text-2xl font-bold mt-1">{isConnected ? `${balance} ETH` : "—"}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;