// ** MUI Import
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Logo from "../logo";

const FallbackSpinner = ({ height = "100vh" }) => {
  return (
    <Box
      sx={{
        height: height,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box sx={{ pt: 2 }}>
        <Logo />
      </Box>
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  );
};

export default FallbackSpinner;
