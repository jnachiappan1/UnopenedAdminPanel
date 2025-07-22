import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { toastError, toastSuccess } from "src/utils/utils";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// =================== Styles =====================
const validationSchema = yup.object().shape({
  name: yup.string().trim().required("Please Enter Role Name."),
});

const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  padding: 0,
  color: "transparent",
  border: "1px solid #506077",
  borderRadius: "3px",
  height: "15px",
  width: "15px",
  "&.Mui-checked": {
    border: "1px solid #7B8393",
    borderRadius: "3px",
    position: "relative",
    "&:before": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "10px",
      height: "10px",
      borderRadius: "2px",
      transform: "translate(-50%, -50%)",
    },
  },
  "& .MuiTouchRipple-root": {
    display: "none",
  },
}));

const AddEditRolePage = () => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("");
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [permissionList, setPermissionList] = useState([]);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (location.pathname.includes("/roles/add")) setMode("add");
    else if (location.pathname.includes("/roles/edit") && id) setMode("edit");
  }, [location.pathname, id]);

  useEffect(() => {
    const dataToEdit = location.state?.dataToEdit || {};

    if (mode === "edit" && dataToEdit?.name) {
      reset({ name: dataToEdit?.name || "" });
    }
  }, [mode, location.state, reset]);

  // useEffect(() => {
  //   setPermissionList(location?.state?.permissions || []);
  // }, [location?.state]);

  useEffect(() => {
    setPermissionList(location?.state?.permissions || []);
    setPermissionsLoaded(false); // Reset flag when permissions change
  }, [location?.state?.permissions]);

  // useEffect(() => {
  //   const dataToEdit = location.state?.dataToEdit || {};

  //   if (
  //     mode === "edit" &&
  //     dataToEdit?.permission &&
  //     permissionList.length > 0
  //   ) {
  //     const updatedList = permissionList.map((perm) => {
  //       const matched = dataToEdit.permission[perm.permission_id];
  //       return {
  //         ...perm,
  //         read: matched?.read || false,
  //         write: matched?.write || false,
  //         add: matched?.add || false,
  //         remove: matched?.remove || false,
  //       };
  //     });
  //     setPermissionList(updatedList);
  //   }
  // }, [mode, location?.state, permissionList?.length]);

  useEffect(() => {
    const dataToEdit = location.state?.dataToEdit || {};

    if (
      mode === "edit" &&
      dataToEdit?.permission &&
      permissionList.length > 0 &&
      !permissionsLoaded
    ) {
      console.log("🔍 Applying permissions for edit mode");
      console.log("dataToEdit.permission:", dataToEdit.permission);

      const updatedList = permissionList.map((perm) => {
        let matched;

        if (Array.isArray(dataToEdit.permission)) {
          matched = dataToEdit.permission.find(
            (p) => p.permission_id === perm.permission_id
          );
        } else {
          matched = dataToEdit.permission[perm.permission_id];
        }

        console.log(`Permission ${perm.name}:`, matched);

        return {
          ...perm,
          read: matched?.read || false,
          write: matched?.write || false,
          add: matched?.add || false,
          remove: matched?.remove || false,
        };
      });

      setPermissionList(updatedList);
      setPermissionsLoaded(true);
    }
  }, [
    mode,
    location?.state?.dataToEdit,
    permissionList.length,
    permissionsLoaded,
  ]);

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setPermissionList((prev) =>
      prev.map((perm) => ({
        ...perm,
        read: checked,
        write: checked,
        add: checked,
        remove: checked,
      }))
    );
  };

  const handleCheckboxChange = (index, type) => (event) => {
    const checked = event.target.checked;
    setPermissionList((prev) =>
      prev.map((perm, i) =>
        i === index
          ? {
              ...perm,
              [type]: checked,
            }
          : perm
      )
    );
  };

  const allSelected = permissionList.every(
    (perm) => perm.read && perm.write && perm.add && perm.remove
  );
  const someSelected = permissionList.some(
    (perm) => perm.read || perm.write || perm.add || perm.remove
  );

  const onSubmit = (data) => {
    // const permissionsObj = permissionList.reduce((acc, perm) => {
    //   acc[perm.permission_id] = {
    //     read: perm.read,
    //     write: perm.write,
    //     add: perm.add,
    //     remove: perm.remove
    //   }
    //   return acc
    // }, {})

    const permissionsArray = permissionList.map((perm) => ({
      permission_id: perm.permission_id,
      read: perm.read,
      write: perm.write,
      add: perm.add,
      remove: perm.remove,
    }));

    // const payload = {
    //   name: data.name,
    //   permission: permissionsObj,
    // };

    const payload = {
      name: data.name,
      permission: permissionsArray,
    };

    setLoading(true);

    const apiInstance =
      mode === "edit"
        ? axiosInstance.patch(ApiEndPoints.ROLE.edit(id), payload)
        : axiosInstance.post(ApiEndPoints.ROLE.add, payload);

    apiInstance
      .then((response) => response.data)
      .then((response) => {
        toastSuccess(response.message);
        navigate("/roles");
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Box
        component="form"
        id="role-management-form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 5 }}
      >
        <Card>
          <CardContent>
            <Box sx={{ mb: 5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton
                  sx={{
                    border: "2px solid",
                    borderColor: "primary.main",
                    p: 0.5,
                  }}
                  onClick={() => navigate(-1)}
                >
                  <ArrowBackIcon
                    sx={{ color: "primary.main" }}
                    fontSize="small"
                  />
                </IconButton>
                <Typography variant="h6">
                  {mode === "add" ? "Add New Role" : "Edit Role"}
                </Typography>
              </Box>
              <Divider />
            </Box>
            <FormControl fullWidth>
              <FormLabel htmlFor="name" sx={{ color: "#000" }}>
                Role Name
              </FormLabel>
              <Controller
                name="name"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    size="small"
                    id="name"
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.name)}
                    variant="filled"
                    placeholder="Enter Role Name"
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        borderRadius: "8px",
                        backgroundColor: "rgba(0,0,0,0.04)",
                        minHeight: "40px",
                        display: "flex",
                        alignItems: "center",
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" },
                        "&.Mui-focused": {
                          backgroundColor: "rgba(0,0,0,0.06)",
                        },
                        "& .MuiFilledInput-input": {
                          padding: "10px 12px",
                          height: "auto",
                          "&::placeholder": {
                            color: "#9CA3AF",
                            opacity: 1,
                            fontSize: "14px",
                            lineHeight: "1.5",
                          },
                        },
                      },
                    }}
                  />
                )}
              />
              {errors.name && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.name.message}
                </FormHelperText>
              )}
            </FormControl>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography sx={{ fontWeight: "bold" }}>Manage Access*</Typography>
            <Typography sx={{ fontSize: "14px", mb: 2 }}>
              Please select the services which can be accessible by this user
              role.
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography
                        sx={{
                          color: "#111828",
                          fontWeight: 700,
                          fontSize: "16px",
                          lineHeight: "28px",
                          textTransform: "capitalize",
                        }}
                      >
                        Administrator Access
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <FormControlLabel
                        control={
                          <CustomCheckbox
                            checked={allSelected}
                            indeterminate={!allSelected && someSelected}
                            onChange={handleSelectAll}
                          />
                        }
                        label="Select All"
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            marginLeft: "8px",
                            color: "#344054",
                            fontSize: "16px",
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {permissionList.map((perm, index) => (
                    <TableRow key={perm.permission_id}>
                      <TableCell>{perm.name}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            justifyContent: "space-between",
                          }}
                        >
                          {["read", "write", "add", "remove"].map((type) => (
                            <FormControlLabel
                              key={type}
                              control={
                                <CustomCheckbox
                                  checked={perm[type]}
                                  onChange={handleCheckboxChange(index, type)}
                                />
                              }
                              label={type}
                              sx={{
                                "& .MuiFormControlLabel-label": {
                                  marginLeft: "8px",
                                  textTransform: "capitalize",
                                  fontSize: "14px",
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            form="role-management-form"
            variant="contained"
            loading={loading}
          >
            {mode === "add" ? "Add" : "Save Changes"}
          </LoadingButton>
        </Box>
      </Box>
    </>
  );
};

export default AddEditRolePage;
