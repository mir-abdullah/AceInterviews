import React from "react";
import SessionsChart from "../../components/chart/SessionsChart";
import StatCard from "../../components/card/StatCard";

import TotalCustomers from "../../components/card/TotalCustomers";
import InterviewsChart from "../../components/chart/InterviewCharts";

const OverviewAdmin = () => {
  return (
    <>
      <div>
        <TotalCustomers />
        <StatCard />
        <InterviewsChart/>
      </div>
      <SessionsChart />
    </>
  );
};

export default OverviewAdmin;
