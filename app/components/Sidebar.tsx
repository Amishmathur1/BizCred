import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCompass,
  FaMoneyCheckAlt,
  FaChartBar,
} from "react-icons/fa";

const Sidebar: React.FC = () => {
  const balance = "1000.00"; // Replace with actual balance fetching logic
  return (
    <div className="w-[20%] h-screen bg-white border border-black text-black flex flex-col p-4 rounded-xl">
      <div className="text-2xl font-bold flex items-center mb-6">
        <span role="img" aria-label="wallet" className="mr-2"></span>
        BizCred
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
            style={{ borderRadius: "12px" }}
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
        {/* Updated Route */}
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
        <div className="w-full bg-gradient-to-r from-[#281f9f8a] via-[#dc3e3e8c] to-[#e0285f8b] text-white rounded-2xl p-2">
            <h1 className="text-xl text-black font-medium">Balance</h1>
            
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
