// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { Add, Delete, Edit } from "@mui/icons-material";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { axiosInstance } from "../../../network/adapter";
// import { ApiEndPoints } from "../../../network/endpoints";
// import toast from "react-hot-toast";
// import TablePermission from "src/views/tables/TablePermission";

// const schema = yup.object().shape({
//   name: yup.string().required("Permission name is required"),
// });

// const PermissionsPage = () => {
//   const [permissions, setPermissions] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedPermission, setSelectedPermission] = useState(null);
//   const [page, setPage] = useState(0);
//   const [limit, setLimit] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [search, setSearch] = useState("");

//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   useEffect(() => {
//     fetchPermissions();
//   }, [page, limit, search]);

//   const fetchPermissions = async () => {
//     try {
//       const response = await axiosInstance.get(ApiEndPoints.PERMISSION.getAll, {
//         params: {
//           page: page + 1,
//           limit,
//           search,
//         },
//       });
//       const data = response.data.data.permission || [];
//       console.log(data);

//       setPermissions(data);
//       setTotal(response.data.data.totalCount || 0);
//     } catch (error) {
//       toast.error("Failed to fetch permissions");
//     }
//   };

//   const handleOpenCreate = () => {
//     reset();
//     setSelectedPermission(null);
//     setOpenDialog(true);
//   };

//   const handleOpenEdit = (perm) => {
//     reset();
//     setSelectedPermission(perm);
//     setValue("name", perm.name);
//     setOpenDialog(true);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axiosInstance.delete(ApiEndPoints.PERMISSION.delete(id));
//       toast.success("Permission deleted");
//       fetchPermissions();
//     } catch {
//       toast.error("Failed to delete permission");
//     }
//   };

//   const onSubmit = async (data) => {
//     try {
//       if (selectedPermission) {
//         await axiosInstance.patch(
//           ApiEndPoints.PERMISSION.update(selectedPermission.id),
//           {
//             name: data.name,
//           }
//         );
//         toast.success("Permission updated successfully");
//       } else {
//         await axiosInstance.post(ApiEndPoints.PERMISSION.add, data);
//         toast.success("Permission created successfully");
//       }

//       setOpenDialog(false);
//       fetchPermissions();
//       reset();
//       setSelectedPermission(null);
//     } catch (err) {
//       toast.error("Failed to save permission");
//     }
//   };

//   return (
//     <Box p={3}>
//       <Box display="flex" justifyContent="space-between" mb={3}>
//         <Typography variant="h5">Permissions</Typography>
//         <Button
//           variant="contained"
//           startIcon={<Add />}
//           onClick={handleOpenCreate}
//         >
//           Create Permission
//         </Button>
//       </Box>

//       <TextField
//         label="Search"
//         fullWidth
//         value={search}
//         onChange={(e) => {
//           setSearch(e.target.value);
//           setPage(0);
//         }}
//         sx={{ mb: 2 }}
//       />

//       <TablePermission
//         rows={permissions}
//         totalCount={total}
//         currentPage={page}
//         pageSize={limit}
//         setCurrentPage={(newPage) => setPage(newPage)}
//         setPageSize={(newLimit) => {
//           setLimit(newLimit);
//           setPage(0);
//         }}
//         loading={false}
//         handleEdit={handleOpenEdit}
//         handleDelete={handleDelete}
//       />

//       {/* Create/Edit Permission Dialog */}
//       <Dialog
//         open={openDialog}
//         onClose={() => setOpenDialog(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>
//           {selectedPermission ? "Edit Permission" : "Create Permission"}
//         </DialogTitle>
//         <DialogContent>
//           <TextField
//             margin="dense"
//             fullWidth
//             label="Permission Name"
//             {...register("name")}
//             error={Boolean(errors.name)}
//             helperText={errors.name?.message}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//           <Button variant="contained" onClick={handleSubmit(onSubmit)}>
//             {selectedPermission ? "Update" : "Create"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default PermissionsPage;
import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PageHeader from "src/@core/components/page-header";
import Translations from "src/layouts/components/Translations";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { DefaultPaginationSettings } from "src/constants/general.const";
import { toastError, toastSuccess } from "src/utils/utils";
import Tableproduct from "src/views/tables/Tableproduct";
import Grid from "@mui/material/Grid2";
import DialogConfirmation from "src/views/dialogs/DialogConfirmation";
import Dialogproducts from "src/views/dialogs/Dialogproduct";
import TablePermission from "src/views/tables/TablePermission";
import Dialogpermission from "src/views/dialogs/DialogPermission";

const ProductPage = () => {
  const searchTimeoutRef = useRef();
  const [loading, setLoading] = useState(false);
  const [careerData, setCareerData] = useState([]);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    DefaultPaginationSettings.ROWS_PER_PAGE
  );
  const [careerFormDialogOpen, setCareerFormDialogOpen] = useState(false);
  const [careerFormDialogMode, setCareerFormDialogMode] = useState("add");
  const [careerToEdit, setCareerToEdit] = useState(null);

  const togglecareerFormDialog = (e, mode = "add", careerToEdit = null) => {
    setCareerFormDialogOpen((prev) => !prev);
    setCareerFormDialogMode(mode);
    setCareerToEdit(careerToEdit);
  };

  const [confirmationDialogLoading, setConfirmationDialogLoading] =useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [careerToDelete, setcareerToDelete] = useState(null);

  const toggleConfirmationDialog = (e, dataToDelete = null) => {
    setConfirmationDialogOpen((prev) => !prev);
    setcareerToDelete(dataToDelete);
  };

  const fetchData = ({
    currentPage,
    pageSize = DefaultPaginationSettings.ROWS_PER_PAGE,
    search,
  }) => {
    setLoading(true);
    let params = {
      page: currentPage,
      limit: pageSize,
      search: search,
    };
    axiosInstance
      .get(ApiEndPoints.PERMISSION.list, { params })
      .then((response) => {
        console.log(response.data.data.permission);
        setCareerData(response.data.data.permission);
        setTotalCount(response.data.data.totalCount);
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData({
      currentPage: currentPage,
      pageSize: pageSize,
      search: search,
    });
  }, [currentPage, pageSize, search]);

  const handleSearchChange = (e) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearch(e.target.value);
    }, 500);
  };

  const onConfirmDelete = useCallback(
    (e) => {
      e?.preventDefault();
      setConfirmationDialogLoading(true);
      axiosInstance
        .delete(ApiEndPoints.PERMISSION.delete(careerToDelete.id))
        .then((response) => response.data)
        .then((response) => {
          fetchData({
            currentPage: currentPage,
            pageSize: pageSize,
          });
          toggleConfirmationDialog();
          toastSuccess(response.message);
        })
        .catch((error) => {
          toastError(error);
        })
        .finally(() => {
          setConfirmationDialogLoading(false);
        });
    },
    [careerToDelete, currentPage, pageSize]
  );
  return (
    <>
      <Grid container spacing={4} className="match-height">
        <PageHeader
          title={
            <Typography variant="h5">
              <Translations text="Permission" />
            </Typography>
          }
          action={
            // <Button variant='contained' onClick={togglecareerFormDialog}>
            //   Add Category
            // </Button>
            <Button
              variant="contained"
              onClick={(e) => togglecareerFormDialog(e, "add")}
            >
              Add Permission
            </Button>
          }
        />
        <Grid size={12}>
          <Card>
            <Box
              sx={{
                p: 5,
                pb: 0,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box></Box>
              <Box
                sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
              >
                <TextField
                  type="search"
                  size="small"
                  placeholder="Search"
                  onChange={handleSearchChange}
                />
              </Box>
            </Box>
            <Box sx={{ p: 5 }}>
              <TablePermission
                search={search}
                loading={loading}
                rows={careerData}
                totalCount={totalCount}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                setPageSize={setPageSize}
                pageSize={pageSize}
                toggleEdit={togglecareerFormDialog}
                toggleDelete={toggleConfirmationDialog}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Dialogpermission
        mode={careerFormDialogMode}
        open={careerFormDialogOpen}
        toggle={togglecareerFormDialog}
        dataToEdit={careerToEdit}
        onSuccess={() => {
          fetchData({
            currentPage: currentPage,
            pageSize: pageSize,
          });
        }}
      />
      <DialogConfirmation
        loading={confirmationDialogLoading}
        title="Delete Permission"
        subtitle="Are you sure you want to delete this Permission?"
        open={confirmationDialogOpen}
        toggle={toggleConfirmationDialog}
        onConfirm={onConfirmDelete}
      />
    </>
  );
};

export default ProductPage;
