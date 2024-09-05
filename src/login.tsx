import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Grid,
  Stack,
  TextField,
  Button,
  Typography,
  Box,
  CardMedia,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { setUsername } from "./store/auth-slice";
import { useNavigate, useLocation } from "react-router-dom";
import { setAccessToken } from "./services/auth-interceptor";
import { login } from "./services/user-service";
import { setLoading } from "./store/loading-slice";
import { useSnackbar } from "./components/Snackbar";

interface LoginData {
  customerCode: string;
  username: string;
  password: string;
}

// Define the validation schema using yup
const schema = yup.object().shape({
  customerCode: yup.string().required("Customer code is required"),
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const theme = useTheme();
  const isMediumUp = useMediaQuery(theme.breakpoints.up("md"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { showSnackbar } = useSnackbar();

  const from = location.state?.from?.pathname || "/patients/portal";

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginData>({
    resolver: yupResolver(schema) as any,
    mode: "onChange", // This ensures isValid is updated on form changes
  });

  const onSubmit = async (data: LoginData) => {
    try {
      dispatch(setLoading(true));
      const loginRequest = {
        customerCode: data.customerCode,
        username: data.username,
        password: data.password,
      };
      const accessToken = await login(loginRequest);
      if (accessToken) {
        setAccessToken(accessToken);
        dispatch(setUsername(data.username));
        navigate(from, { replace: true });
      } else {
        console.error("Invalid login credentials");
        showSnackbar("Invalid login credentials", "error");
      }
    } catch (error) {
      console.error("An error occurred while logging in", error);
      showSnackbar("An error occurred while logging in", "error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {" "}
      {/* Add top margin here */}
      <Grid container spacing={2}>
        {isMediumUp && (
          <Grid item md={6} sx={{ height: "90vh" }}>
            <CardMedia
              component="img"
              image={`${process.env.PUBLIC_URL}/images/hospital.jpg`}
              alt="Hospital"
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Welcome to the Hospital Login Page
          </Typography>
          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Controller
                name="customerCode"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Customer Code"
                    fullWidth
                    margin="normal"
                    size="small"
                    sx={{ width: { md: "75%" } }}
                    error={!!errors.customerCode}
                    helperText={
                      errors.customerCode ? errors.customerCode.message : ""
                    }
                  />
                )}
              />
              <Controller
                name="username"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Username"
                    fullWidth
                    margin="normal"
                    size="small"
                    sx={{ width: { md: "75%" } }}
                    error={!!errors.username}
                    helperText={errors.username ? errors.username.message : ""}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    size="small"
                    sx={{ width: { md: "75%" } }}
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ""}
                  />
                )}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting || !isValid}
                sx={{ alignSelf: "flex-start" }}
              >
                Login
              </Button>
            </Stack>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
