"use client";

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Batch, Subject } from "@/features/users/user.type";

import {
  createSessionSchema,
  CreateSessionFormData,
} from "./create-session.schema";

import { useAppDispatch } from "@/hooks/dispatch";
import { CreateSessionAction } from "@/features/session/create-session/create-session.action";

interface CreateSessionFormProps {
  teacherId: string;
  onSuccess?: () => void;
}

const CreateSessionForm = ({
  teacherId,
  onSuccess,
}: CreateSessionFormProps) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSessionFormData>({
    resolver: zodResolver(createSessionSchema),

    defaultValues: {
      sessionNo: undefined,
      batch: undefined,
      subject: undefined,
    },
  });

  const onSubmit = async (data: CreateSessionFormData) => {
    const sessionData = {
      ...data,
      teacherId,
    };

    try {
      await dispatch(CreateSessionAction(sessionData)).unwrap();
      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >

      <TextField
        label="Session Number"
        type="number"
        fullWidth
        error={!!errors.sessionNo}
        helperText={errors.sessionNo?.message}
        {...register("sessionNo", {
          valueAsNumber: true,
        })}
        slotProps={{
          htmlInput: {
            min: 1,
          },
        }}
      />


      <FormControl fullWidth error={!!errors.batch}>
        <InputLabel id="batch-label">Batch</InputLabel>

        <Select
          labelId="batch-label"
          label="Batch"
          defaultValue=""
          {...register("batch")}
        >
          {Object.values(Batch).map((batch) => (
            <MenuItem key={batch} value={batch}>
              {batch}
            </MenuItem>
          ))}
        </Select>

        {errors.batch && (
          <FormHelperText>{errors.batch.message}</FormHelperText>
        )}
      </FormControl>


      <FormControl fullWidth error={!!errors.subject}>
        <InputLabel id="subject-label">Subject</InputLabel>

        <Select
          labelId="subject-label"
          label="Subject"
          defaultValue=""
          {...register("subject")}
        >
          {Object.values(Subject).map((subject) => (
            <MenuItem key={subject} value={subject}>
              {subject}
            </MenuItem>
          ))}
        </Select>

        {errors.subject && (
          <FormHelperText>{errors.subject.message}</FormHelperText>
        )}
      </FormControl>


      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create Session"}
      </Button>
    </Box>
  );
};

export default CreateSessionForm;
