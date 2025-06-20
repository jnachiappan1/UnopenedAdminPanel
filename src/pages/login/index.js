import { Box, FormHelperText } from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Translations from "src/layouts/components/Translations";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FormValidationMessages } from "src/constants/form.const";
import { useAuth } from "src/hooks/useAuth";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { toastError, toastSuccess } from "src/utils/utils";
import { Link } from "react-router-dom";

const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("xl")]: {
    width: "100%",
  },
  [theme.breakpoints.down("md")]: {
    maxWidth: 500,
  },
}));
const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  textDecoration: "none",
  color: theme.palette.primary.main,
}));
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email(FormValidationMessages.EMAIL.invalid)
    .required(FormValidationMessages.EMAIL.required),
  password: yup
    .string()
    .min(
      FormValidationMessages.PASSWORD.minLength,
      FormValidationMessages.PASSWORD.minLengthErrorMessage
    )
    .matches(
      FormValidationMessages.PASSWORD.pattern,
      FormValidationMessages.PASSWORD.patternErrorMessage
    )
    .required(FormValidationMessages.PASSWORD.required),
});

const LoginPage = () => {
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "admin@unopened.com",
      password: "Admin@123",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const onSubmit = (data) => {
    setLoading(true);
    let payload = {
      email: data.email,
      password: data.password,
    };
    axiosInstance
      .post(ApiEndPoints.AUTH.login, payload)
      .then((response) => response.data)
      .then((response) => {
        toastSuccess(response.message);
        auth.login(response.data);
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Box
        sx={{
          p: { md: 12, xs: 8 },
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.paper",
          borderRadius: "20px",
        }}
      >
        <BoxWrapper>
          <Box sx={{ mb: 6 }}>
            <Typography variant="fm-h3" color="neutral.90" fontWeight="medium">
              <Translations text="Sign In" />
            </Typography>
            <Typography
              variant="fm-p2"
              sx={{ mt: 3, mb: 3 }}
              color="neutral.70"
              display="block"
            >
              <Translations text="Enter admin panel credentials" />
            </Typography>
          </Box>
          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <FormLabel htmlFor="email">Email Address</FormLabel>
              <Controller
                name="email"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    autoFocus
                    onChange={onChange}
                    id="email"
                    value={value}
                    placeholder="Enter Email here"
                  />
                )}
              />
              {errors.email && (
                <FormHelperText sx={{ color: "error.main" }}>
                  <Translations text={`${errors.email.message}`} />
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field: { value, onChange } }) => (
                  <TextField
                    id="password"
                    placeholder="Enter Password here"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={value}
                    onChange={onChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePassword}
                            edge="start"
                          >
                            {showPassword ? (
                              <Visibility fontSize="small" />
                            ) : (
                              <VisibilityOff fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              {errors.password && (
                <FormHelperText sx={{ color: "error.main" }}>
                  <Translations text={`${errors.password.message}`} />
                </FormHelperText>
              )}
            </FormControl>
            <Box
              sx={{
                mb: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
              }}
            >
              <LinkStyled to="/forgot-password">Forgot Password?</LinkStyled>
            </Box>
            <LoadingButton
              fullWidth
              loading={loading}
              size="large"
              type="submit"
              variant="contained"
            >
              <Translations text="Sign In" />
            </LoadingButton>
          </form>
        </BoxWrapper>
      </Box>
    </>
  );
};

export default LoginPage;
