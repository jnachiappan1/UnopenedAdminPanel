import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
//CONFIGS
import { useForm } from "react-hook-form";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import Translations from "src/layouts/components/Translations";
import { LoadingButton } from "@mui/lab";
import Grid from "@mui/material/Grid2";

const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
});

const passwordResetBtnStyle = {
  marginTop: "20px",
};

const BackToLoginStyle = {
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "normal",
  textAlign: "center",
  marginTop: "30px",
  "&:hover": {
    color: "#000000",
    boxShadow: "none",
  },
};

function ForgotPasswordForm({ onSuccess }) {
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(schema),
  });

  const handleSetOtp = async () => {
    try {
      const response = await axiosInstance.post(ApiEndPoints.AUTH.forgot, {
        email: userEmail,
      });
      if (response.status === 200) {
        const Token = response.data.data.token;
        onSuccess(userEmail, Token);
        toast.success(response.data.message);
      }
      // console.log("otp", response.data.data.otp)
    } catch (error) {
      // console.log(error)
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      {" "}
      <form onSubmit={handleSubmit(handleSetOtp)}>
        <Typography variant="h5" color={"neutral.90"}>
          Forgot Password
        </Typography>
        <Grid container sx={{ textAlign: "left", marginTop: "1vh" }}>
          <Grid item size={12}>
            <Typography variant="subtitle1">
              Enter the email address associated with your account
            </Typography>
          </Grid>
        </Grid>
        <FormControl fullWidth margin="dense">
          <TextField
            {...register("email")}
            id="standard-basic"
            variant="outlined"
            autoFocus
            onChange={(e) => {
              setUserEmail(e.target.value);
            }}
            placeholder="Enter Email Address"
            error={error}
            helperText={error ? "Email Address is required" : ""}
          />
          <small style={{ color: "#FF0000", marginRight: "auto" }}>
            {errors.email?.message}
          </small>
        </FormControl>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          sx={{ ...passwordResetBtnStyle }}
        >
          <Translations text="Send OTP" />
        </LoadingButton>
      </form>
      <Link to="/login" style={{ textDecoration: "none" }}>
        <Typography variant="body2" sx={{ ...BackToLoginStyle }}>
          <IconButton color="inherit" size="small">
            <ArrowBackIcon />
          </IconButton>
          Back to Login
        </Typography>
      </Link>
    </>
  );
}

export default ForgotPasswordForm;
