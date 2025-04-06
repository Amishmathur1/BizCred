
import DashboardHero from "~/components/DashboardHero";
import Sidebar from "~/components/Sidebar";
import Collateral from "~/components/CollateralCard";

function Collaterals() {
  return (
    <div className="w-screen overflow-clip">
      <div className="flex items-start place-content-center justify-between gap-5 p-2">
        <Sidebar />
        <div className="flex flex-col gap-5 w-full">
          <DashboardHero />
          <div className="flex items-center justify-around gap-5">
            <Collateral
              companyName="ABC Corp"
              companyDescription="ABC Corp is a leading technology company specializing in software development and IT services."
              loan="$500,000"
            />
            <Collateral
              companyName="XYZ Ltd"
              companyDescription="XYZ Ltd is a manufacturing company specializing in consumer goods and industrial products."
              loan="$750,000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Collaterals;
