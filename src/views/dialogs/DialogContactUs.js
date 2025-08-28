import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "mdi-material-ui/Close";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "../../network/adapter";
import { ApiEndPoints } from "../../network/endpoints";
import * as yup from "yup";
import { toastError, toastSuccess } from "../../utils/utils";

const validationSchema = yup.object().shape({
  admin_response: yup.string().trim().required("Admin response is required."),
});

const DialogContactUs = (props) => {
  const { mode, open, toggle, dataToEdit, onSuccess } = props;
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      admin_response: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      setLoading(false);
      reset({
        admin_response: dataToEdit?.admin_response || "",
      });
    }
  }, [mode, dataToEdit, open, reset]);

  const onSubmit = (data) => {
    const payload = {
      admin_response: data.admin_response,
    };
    setLoading(true);

    // Only PATCH API call for admin response
    axiosInstance
      .patch(ApiEndPoints.CONTACT_US.respond(dataToEdit.id), payload)
      .then((response) => response.data)
      .then((response) => {
        onSuccess();
        toastSuccess(response.message);
        toggle();
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={open} onClose={toggle} fullWidth maxWidth="sm" scroll="paper">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="fm-h6" textTransform={"capitalize"}>
          Reply to Contact
        </Typography>
        <IconButton
          aria-label="close"
          onClick={toggle}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 } }}
      >
        <form id="contact-response-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Original Message Display */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel>Original Message</FormLabel>
            <Typography
              variant="body2"
              sx={{
                p: 2,
                backgroundColor: (theme) => theme.palette.grey[100],
                borderRadius: 1,
                minHeight: 80,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {dataToEdit?.message || "No message available"}
            </Typography>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel
              required
              htmlFor="admin_response"
              error={Boolean(errors.admin_response)}
            >
              Admin Response
            </FormLabel>
            <Controller
              name="admin_response"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  placeholder="Enter your response to the contact"
                  multiline
                  rows={4}
                  autoFocus
                  onChange={onChange}
                  id="admin_response"
                  value={value}
                  error={Boolean(errors.admin_response)}
                />
              )}
            />
            {errors.admin_response && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.admin_response.message}
              </FormHelperText>
            )}
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          size="large"
          type="submit"
          form="contact-response-form"
          variant="contained"
          loading={loading}
        >
          Send Response
        </LoadingButton>
        <Button variant="outlined" onClick={toggle}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogContactUs;
