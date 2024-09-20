import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { VscArrowDown as ArrowDownIcon } from "react-icons/vsc"; // Using react-icons for consistency
import { VscArrowUp as ArrowUpIcon } from "react-icons/vsc"; // Using react-icons for consistency
import { PiUsersDuotone as UsersIcon } from "react-icons/pi"; // Using react-icons for consistency

// Static data array
const customerData = [
  {
    diff: 10,
    trend: "up",
    sx: {},
    value: "1,200",
  },
];

const TotalCustomers = () => {
  return (
    <>
      {customerData.map((data, index) => {
        const TrendIcon = data.trend === "up" ? ArrowUpIcon : ArrowDownIcon;
        const trendColor =
          data.trend === "up"
            ? "var(--mui-palette-success-main)"
            : "var(--mui-palette-error-main)";

        return (
          <Card key={index} sx={data.sx}>
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
                    <Typography variant="h4">{data.value}</Typography>
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
                {data.diff ? (
                  <Stack
                    sx={{ alignItems: "center" }}
                    direction="row"
                    spacing={2}
                  >
                    <Stack
                      sx={{ alignItems: "center" }}
                      direction="row"
                      spacing={0.5}
                    >
                      <TrendIcon
                        color={trendColor}
                        fontSize="var(--icon-fontSize-md)"
                      />
                      <Typography color={trendColor} variant="body2">
                        {data.diff}%
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
      })}
    </>
  );
};

export default TotalCustomers;
