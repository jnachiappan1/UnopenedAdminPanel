import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { LoadingButton } from "@mui/lab";
import Translations from "src/layouts/components/Translations";

const schema = yup.object({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Enter Password"),
  confirm_password: yup
    .string("Enter Valid Confirm Password Format")
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .min(8)
    .required("Enter Confirm Password Address"),
});

const passwordResetBtnStyle = {
  marginTop: "20px",
};

function NewPassword({ token }) {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirm_password: "",
    },
    resolver: yupResolver(schema),
  });

  const handleSetOtp = async (e) => {
    try {
      const response = await axiosInstance.post(
        ApiEndPoints.AUTH.reset,
        {
          password: password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        navigate("/login");
      } else {
        console.error("Error: Unexpected response status", response.status);
      }
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 450 }}>
      <form onSubmit={handleSubmit(handleSetOtp)}>
        <Typography sx={{ my: 2 }} variant="h5" color="neutral.90">
          Reset Password
        </Typography>

        <FormControl fullWidth sx={{ mt: 1 }}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            id="password"
            {...register("password")}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Enter Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <small style={{ color: "#FF0000", marginRight: "auto" }}>
            {errors.password?.message}
          </small>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 4 }}>
          <FormLabel htmlFor="confirm_password">Confirm Password</FormLabel>
          <TextField
            id="confirm_password"
            {...register("confirm_password")}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Enter Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="current-password"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleToggleConfirmPassword} edge="end">
                    {showConfirmPassword ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2" color="error">
            {errors.confirm_password?.message}
          </Typography>
        </FormControl>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          sx={{ ...passwordResetBtnStyle }}
        >
          <Translations text="Reset Password" />
        </LoadingButton>
      </form>
    </Box>
  );
}

export default NewPassword;
