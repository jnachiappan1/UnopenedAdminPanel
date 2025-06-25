import { Box, Card, CardContent, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FallbackSpinner from "src/@core/components/spinner";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { toastError } from "src/utils/utils";
import Grid from "@mui/material/Grid2";

const data = [
  {
    stats: "0",
    title: "Active Users",
    type: "active users",
    link: "/service",
  },
  {
    stats: "0",
    title: "Listings",
    type: "listings",
    link: "/inquiry",
  },
  {
    stats: "0",
    title: "Sales",
    type: "sales",
    link: "/contact",
  },
];
function DashBoardPage() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = React.useState(data);
  const fetchData = () => {
    setLoading(true);

    axiosInstance
      .get(ApiEndPoints.DASHBOARD.count)
      .then((response) => {
        let data = response.data.data.counts;
        console.log("data", data);

        setStats((prev) =>
          prev.map((p) => ({
            ...p,
            ...(data[`${p.type}`] && { stats: data[`${p.type}`] }),
          }))
        );
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    // fetchData();
  }, []);
  if (loading) {
    return <FallbackSpinner />;
  }
  return (
    <>
      <Grid container spacing={6} height={100}>
        {stats.map((item, index) => (
          <Grid key={index} size={{ xs: 12, sm: 4 }}>
            <Typography
              component={Link}
              to={item.link}
              key={index}
              variant="body1"
              sx={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  overflow: "visible",
                  position: "relative",
                  border: "1px solid #31AD52",
                  backgroundImage: `url('/assets/images/logo.png')`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "bottom right",
                  borderRadius: "8px",
                }}
              >
                <CardContent>
                  <Typography sx={{ mb: 10, fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                  <Box>
                    <Typography key={index} variant="h5">
                      {item.stats}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Typography>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default DashBoardPage;
