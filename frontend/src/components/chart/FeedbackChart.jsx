import React, { PureComponent } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import { Card, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { FaChartPie } from "react-icons/fa"; // Icon for the heading

// Static feedback data (rating 1-5)
const data = [
  { name: "Rating 5", value: 37, fill: "#4CAF50" }, // Excellent reviews
  { name: "Rating 4", value: 23, fill: "#2196F3" }, // Good reviews
  { name: "Rating 3", value: 15, fill: "#FFC107" }, // Average reviews
  { name: "Rating 2", value: 10, fill: "#FF5722" }, // Poor reviews
  { name: "Rating 1", value: 4, fill: "#F44336" }, // Very poor reviews
];

// Custom active shape for PieChart
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >
        {`PV ${value}`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default class FeedbackChartCard extends PureComponent {
  state = {
    activeIndex: 0,
  };

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  render() {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex justify-center mb-8"
      >
        <Card
          className="shadow-lg rounded-lg p-8 bg-white hover:shadow-2xl transition-shadow duration-300 relative"
          sx={{
            width: "500px",
            padding: "20px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "15px",
          }}
        >
          {/* Fancy Header with Icon */}
          <div className="flex items-center gap-2 mb-6">
            <FaChartPie size={30} className="text-green-500" />
            <Typography
              variant="h5"
              className="text-center font-bold text-gray-800"
            >
              Feedback Overview
            </Typography>
          </div>

          {/* Recharts Pie Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                activeIndex={this.state.activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90} // Increased for better visibility
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={this.onPieEnter}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Additional Info or Stats (Optional) */}
          <Typography variant="body2" className="text-gray-600 mt-4">
            Hover over the chart to see detailed stats.
          </Typography>
        </Card>
      </motion.div>
    );
  }
}
