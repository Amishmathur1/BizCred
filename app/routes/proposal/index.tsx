import React from 'react';
import { Link } from '@remix-run/react';
import DashboardHero from '~/components/DashboardHero';
import Sidebar from '~/components/Sidebar';

export default function ProposalIndex() {
  return (
    <div className="w-screen overflow-clip">
      <div className="flex items-start place-content-center justify-between gap-5 p-2">
        <Sidebar />
        <div className="flex flex-col gap-5 w-full">
          <DashboardHero />
          <div className="bg-blue-900 text-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Proposals Dashboard</h2>
            <p className="mb-6">
              The proposal cards have been moved to the main dashboard for better organization and user experience.
              Please visit the dashboard to view and manage your proposals.
            </p>
            <Link 
              to="/dashboard" 
              className="bg-white text-blue-900 hover:bg-blue-100 transition duration-300 px-6 py-3 rounded-lg font-medium inline-block"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 