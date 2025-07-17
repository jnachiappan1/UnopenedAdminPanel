import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { axiosInstance } from "../../network/adapter";
import { ApiEndPoints } from "../../network/endpoints";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  name: yup.string().required("Role name is required"),
});

const EditRoleModal = ({ open, onClose, role, onUpdated }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (role) {
      reset({ name: role.name });
    }
  }, [role, reset]);

  const onSubmit = async (data) => {
    try {
      await axiosInstance.put(ApiEndPoints.ROLE.update(role._id), data);
      toast.success("Role updated successfully");
      onUpdated();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Role</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Role Name"
          fullWidth
          {...register("name")}
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRoleModal;
