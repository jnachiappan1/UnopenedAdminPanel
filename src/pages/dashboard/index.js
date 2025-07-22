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
    link: "/users",
  },
  {
    stats: "0",
    title: "Listings",
    type: "listings",
    // link: "/inquiry",
    link:"/product"
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
  // const fetchData = () => {
  //   setLoading(true);

  //   axiosInstance
  //     .get(ApiEndPoints.DASHBOARD.count)
  //     .then((response) => {
  //       let myData = response.data;
  //       console.log("myData", myData);
  //       // setStats(myData.user_count);
  //       setProductCount(myData.product_count);
  //       setStats((prev) =>
  //         prev.map((p) => ({
  //           ...p,
  //           ...(data[`${p.type}`] && { stats: data[`${p.type}`] }),
  //         }))
  //       );
  //     })
  //     .catch((error) => {
  //       toastError(error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };
  
  const fetchData = () => {
  setLoading(true);

  axiosInstance
    .get(ApiEndPoints.DASHBOARD.count)
    .then((response) => {
      const { user_count, product_count } = response.data.data;

      const updatedStats = data.map((item) => {
        if (item.type === "active users") {
          return { ...item, stats: user_count };
        } else if (item.type === "listings") {
          return { ...item, stats: product_count }; 
        }
        return item;
      });

      setStats(updatedStats);
    })
    .catch((error) => {
      toastError(error);
    })
    .finally(() => {
      setLoading(false);
    });
};

  
  useEffect(() => {
    fetchData();
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
