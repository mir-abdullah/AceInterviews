import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { VscArrowDown as ArrowDownIcon } from "react-icons/vsc"; // Using react-icons for consistency
import { VscArrowUp as ArrowUpIcon } from "react-icons/vsc"; // Using react-icons for consistency
import { PiUsersDuotone as UsersIcon } from "react-icons/pi"; // Using react-icons for consistency
import { fetchTotalUsers } from '../../redux/slices/admin/statistics/statisctics'

const TotalCustomers = () => {
  const dispatch = useDispatch();

  // Access total users and loading state from the Redux store
  const { totalUsers, loading, error } = useSelector((state) => state.stats);

  useEffect(() => {
    // Dispatch action to fetch total users on component mount
    dispatch(fetchTotalUsers());
  }, [dispatch]);

  // Simulate percentage difference and trend (replace with actual data if available)
  const diff = 10; // Static difference for now
  const trend = "up"; // Static trend for now

  // Determine the trend icon and color based on the trend direction
  const TrendIcon = trend === "up" ? ArrowUpIcon : ArrowDownIcon;
  const trendColor = trend === "up" ? "var(--mui-palette-success-main)" : "var(--mui-palette-error-main)";

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            sx={{
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
            spacing={3}
          >
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Total Customers
              </Typography>
              <Typography variant="h4">
                {loading ? "Loading..." : error ? "Error" : totalUsers.toLocaleString()}
              </Typography>
            </Stack>
            <Avatar
              sx={{
                backgroundColor: "var(--mui-palette-success-main)",
                height: "56px",
                width: "56px",
              }}
            >
              <UsersIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>

          {diff ? (
            <Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
              <Stack sx={{ alignItems: "center" }} direction="row" spacing={0.5}>
                <TrendIcon color={trendColor} fontSize="var(--icon-fontSize-md)" />
                <Typography color={trendColor} variant="body2">
                  {diff}%
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="caption">
                Since last month
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TotalCustomers;
