// Import React
import React from "react";

// Import MUI
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import logo from "../../src/assets/images/logo.png";

// Import Settings Context
import { useSettings } from "src/@core/hooks/useSettings";
import Logo from "src/@core/components/logo";

const RightWrapper = styled(Box)(({ theme }) => ({
  margin: "auto",
  [theme.breakpoints.up("md")]: {
    maxWidth: 750,
  },
}));

const AuthLayout = ({ children }) => {
  const theme = useTheme();
  const { settings } = useSettings();

  const { skin } = settings;
  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <>
      <Grid container className="content-right" spacing={4}>
        <Grid size={12}>
          <Box className="content-center">
            <RightWrapper
              sx={
                skin === "bordered" && !hidden
                  ? { borderLeft: `1px solid ${theme.palette.divider}` }
                  : {}
              }
            >
              {hidden && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  marginBottom="2.5rem"
                  marginTop="2.5rem"
                >
                  <Box sx={{ bgcolor: "#58595B", pt: 2 }}>
                    <Logo />
                  </Box>
                </Box>
              )}

              {children}
            </RightWrapper>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default AuthLayout;
