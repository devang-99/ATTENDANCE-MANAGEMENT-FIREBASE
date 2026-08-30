/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import styles from "./style.module.css";
import {
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RegisterFormData, RegisterUserSchema } from "./sign-up.schema";
import { useAppDispatch } from "@/hooks/dispatch";
import { CustomSignUpAction } from "@/features/users/user-custom-sign-up/user-custom-sign-up.action";
import { Batch, Role, Stream } from "@/features/users/user.type";

export default function Register() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });
  const roleOptions = Object.values(Role);
  const batchOptions = Object.values(Batch);
  const streamOptions = Object.values(Stream);

  const showSnackbar = (message: string) => {
    setSnackbar({
      open: true,
      message,
    });
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterUserSchema),
    shouldUnregister: true,
    mode: "onChange",
    defaultValues: {
      displayName: "",
      email: "",
      batch: Batch["2022-2026"],
      stream: Stream["B-TECH"],
    },
  });

  const selectedRole = watch("role");

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await dispatch(CustomSignUpAction(data));
      reset();
      showSnackbar("Registration successful");
      setTimeout(() => router.push("/dashboard"), 500);
    } catch (error) {
      showSnackbar("User Already Signed In");
      setTimeout(() => router.push("/auth/sign-in"), 500);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.design}>
        <Typography
          sx={{ color: "black"}}
          variant="h3"
        >
          Sign Up
        </Typography>

        <form className={styles.form} onSubmit={handleSubmit(handleRegister)}>
          <TextField
            fullWidth
            label="Name"
            {...register("displayName")}
            error={!!errors.displayName}
            helperText={errors.displayName?.message}
          />

          <TextField
            fullWidth
            label="Email Address"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <Controller
            name="role"
            control={control}
            rules={{ required: "Role is required" }}
            render={({
              field: { onChange, value, ref },
              fieldState: { error },
            }) => (
              <Autocomplete
                options={roleOptions}
                value={value ?? null}
                onChange={(_, newValue) => {
                  onChange(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputRef={ref}
                    label="Select Role"
                    error={!!error}
                    helperText={error ? error.message : null}
                  />
                )}
              />
            )}
          />

          {selectedRole === Role.STUDENT && (
            <>
              <Controller
                name="batch"
                control={control}
                rules={{ required: "Batch is required" }}
                render={({
                  field: { onChange, value, ref },
                  fieldState: { error },
                }) => (
                  <Autocomplete
                    options={batchOptions}
                    value={value ?? null}
                    onChange={(_, newValue) => {
                      onChange(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        inputRef={ref}
                        label="Select Batch"
                        error={!!error}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                )}
              />

              <Controller
                name="stream"
                control={control}
                rules={{ required: "Stream is required" }}
                render={({
                  field: { onChange, value, ref },
                  fieldState: { error },
                }) => (
                  <Autocomplete
                    options={streamOptions}
                    value={value ?? null}
                    onChange={(_, newValue) => {
                      onChange(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        inputRef={ref}
                        label="Select Stream"
                        error={!!error}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                )}
              />
            </>
          )}
        
          <FormControl fullWidth error={!!errors.password}>
            <InputLabel>Password</InputLabel>

            <OutlinedInput
              label="Password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />

            <FormHelperText>{errors.password?.message}</FormHelperText>
          </FormControl>

          <FormControl fullWidth error={!!errors.confirmPassword}>
            <InputLabel>Confirm Password</InputLabel>

            <OutlinedInput
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />

            <FormHelperText>{errors.confirmPassword?.message}</FormHelperText>
          </FormControl>

          <Button type="submit" fullWidth variant="contained">
            Sign Up
          </Button>

        </form>
          <Typography align="center" sx={{color: "black" }}>
            Already have an account? <Link href="/auth/sign-up">Login</Link>
          </Typography>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbar.message}
      />
    </div>
  );
}
