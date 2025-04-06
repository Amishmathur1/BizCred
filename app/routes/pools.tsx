import DashboardHero from "~/components/DashboardHero";
import PoolTable from "~/components/PoolTable";
import Sidebar from "~/components/Sidebar";

function Pool() {
  const pools = [
    {
      name: "Tech Innovators Pool",
      totalFunds: "$5,000,000",
      participants: 25,
      status: "Active",
    },
    {
      name: "Green Energy Pool",
      totalFunds: "$3,200,000",
      participants: 18,
      status: "Closed",
    },
    {
      name: "Healthcare Pool",
      totalFunds: "$4,500,000",
      participants: 30,
      status: "Active",
    },
    {
      name: "Education Pool",
      totalFunds: "$2,800,000",
      participants: 15,
      status: "Pending",
    },
  ];

  return (
    <div className="w-screen overflow-clip">
      <div className="flex items-start place-content-center justify-between gap-5 p-2">
        <Sidebar />
        <div className="flex flex-col gap-5 w-full">
          <DashboardHero />
          <div className="flex flex-col gap-5 w-full h-[35rem] overflow-y-scroll">
            {/* Table */}
            <div className="flex flex-col place-items-start place-content-start gap-5 overflow-y-scroll w-full">
              <PoolTable/>
              <PoolTable/>
              <PoolTable/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pool;
