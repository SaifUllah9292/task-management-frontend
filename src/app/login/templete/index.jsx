"use client";
import * as Yup from "yup";
import Link from "next/link";
import Image from "next/image";
import { useFormik } from "formik";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import TextInput from "@/components/TextInput";
import logo from "../../../../public/logo.png";
import { useSnackbar } from "@/components/Snackbar";
import CustomButton from "@/components/CustomButton";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import {
  useTheme,
  useMediaQuery,
  Typography,
  Box,
  Grid,
  IconButton,
} from "@mui/material";

const Login = () => {
  const theme = useTheme();
  const router = useRouter();
  const snackBarMessage = useSnackbar();
  const isMatch = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email is Required")
        .matches(/\S+@\S+\.\S+/, "Invalid email"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (res?.status === 200) {
          router.push("/dashboard");
          snackBarMessage({
            type: "success",
            message: "Logged in successfully",
          });
          formik.handleReset();
        } else {
          snackBarMessage({
            message: "Email or password does not match",
          });
        }
      } catch (error) {
        snackBarMessage(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Grid container>
      <Grid item lg={6} md={6} sm={6} xs={12}>
        {!isMatch && (
          <Image
            alt="logo"
            src={logo}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "50%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
      </Grid>
      <Grid item lg={6} md={6} sm={6} xs={12}>
        <Box
          sx={{
            height: {
              lg: "100vh",
              md: "100vh",
              sm: "100vh",
              xs: "90vh",
              marginTop: { lg: "0", md: "0", sm: "0", xs: "100px" },
            },
          }}
          className={styles.centeredContainer}
        >
          <Box
            component="form"
            sx={{ width: "100%" }}
            className={styles.centeredContainer}
            onSubmit={formik.handleSubmit}
          >
            {isMatch && (
              <Image
                alt="logo"
                src={logo}
                style={{ width: "30%", height: "100px" }}
              />
            )}
            <Grid container spacing={2} sx={{ marginTop: "10px" }}>
              <Grid item xs={12} className={styles.centeredContainer}>
                <Typography
                  fontSize={"20px"}
                  fontWeight={"bolder"}
                  color={"blue"}
                >
                  Login Form
                </Typography>
              </Grid>
              <Grid item xs={12} className={styles.centeredContainer}>
                <TextInput
                  label="Email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  icon={
                    <IconButton edge="start">
                      <EmailRoundedIcon />
                    </IconButton>
                  }
                />
                {formik.touched.email && formik.errors.email && (
                  <Typography className={styles.error}>
                    {formik.errors.email}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} className={styles.centeredContainer}>
                <TextInput
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  icon={
                    <IconButton edge="start">
                      <LockRoundedIcon />
                    </IconButton>
                  }
                  endIcon={
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOutlinedIcon />
                      ) : (
                        <VisibilityOffOutlinedIcon />
                      )}
                    </IconButton>
                  }
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                  <Typography className={styles.error}>
                    {formik.errors.password}
                  </Typography>
                )}
              </Grid>
              <Grid
                container
                justifyContent="flex-end"
                sx={{ margin: "20px 30px" }}
              >
                <Grid item>
                  <Link href="/forgotpassword">ForgotPassword</Link>
                </Grid>
              </Grid>
              <Grid item xs={12} className={styles.centeredContainer}>
                <CustomButton loading={loading} title="Login" type="submit" />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item>
                <Link href="/signup" variant="body2">
                  <Typography sx={{ margin: "10px 40px" }}>
                    Create New Account ? Signup
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
