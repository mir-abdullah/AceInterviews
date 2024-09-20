import React from "react";
import SessionsChart from "../../components/chart/SessionsChart";
import StatCard from "../../components/card/StatCard";

import TotalCustomers from "../../components/card/TotalCustomers";

const OverviewAdmin = () => {
  return (
    <>
      <div>
        <TotalCustomers />
        <StatCard />
      </div>
      <SessionsChart />
    </>
  );
};

export default OverviewAdmin;
