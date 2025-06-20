import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  FormHelperText,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { LoadingButton } from "@mui/lab";
import Translations from "src/layouts/components/Translations";
import OTPInput from "react-otp-input";

const validationSchema = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is required")
    .matches(/^\d{4}$/, "OTP must be a 4-digit number"),
});

function OtpForm({ onSuccess, email, token }) {
  const [otp, setOtp] = useState("");
  const [open, setOpen] = React.useState(false);

  const { control, handleSubmit, setValue } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleOtpVerify = async (data) => {
    try {
      const response = await axiosInstance.post(
        ApiEndPoints.AUTH.verifyotp,
        {
          otp: data.otp,
          email: email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setOpen(true);
        onSuccess(response.data.data.token);
      } else {
      }
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const handleResendOtp = async () => {
    try {
      const response = await axiosInstance.post(
        ApiEndPoints.AUTH.resendotp,
        {
          email: email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setOtp(""); // Clear local state
        setValue("otp", ""); // Clear react-hook-form field
        toast.success("OTP resent successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data.message || "Failed to resend OTP");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleOtpVerify)}>
        <Typography variant="h5" color="neutral.90" gutterBottom>
          Verify Your OTP
        </Typography>
        <Typography variant="subtitle1">
          Please Enter 4 digit code sent to {otp}
        </Typography>
        <Typography variant="body2" mb={7}>
          {email}
        </Typography>
        <Controller
          name="otp"
          control={control}
          defaultValue=""
          render={({ field, fieldState }) => (
            <>
              <OTPInput
                value={field.value}
                onChange={(value) => {
                  field.onChange(value); // Update react-hook-form state
                  setOtp(value); // Update local otp state
                }}
                numInputs={4}
                renderSeparator={<span style={{ margin: "0 3px" }}></span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    style={{
                      width: "80px",
                      height: "55px",
                      margin: "0 8px",
                      fontSize: "16px",
                      borderRadius: "10px",
                      border: "1px solid #ccc",
                      textAlign: "center",
                      color: "3a3541de",
                    }}
                  />
                )}
              />
            </>
          )}
        />
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Button
            onClick={handleResendOtp}
            sx={{
              mt: 2,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "transparent",
                color: "inherit",
                textDecoration: "none",
              },
            }}
            variant="text"
          >
            Resend OTP
          </Button>
        </Box>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          sx={{ marginTop: "15px" }}
        >
          <Translations text="Verify" />
        </LoadingButton>
        {open && (
          <Snackbar open={open} autoHideDuration={2000}>
            <Alert severity="success" sx={{ width: "100%", color: "fff" }}>
              OTP verified Successfully
            </Alert>
          </Snackbar>
        )}
      </form>
    </>
  );
}

export default OtpForm;
