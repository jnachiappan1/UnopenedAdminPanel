import React, { useState, useEffect } from "react";

// ** MUI Imports
import { DataGrid } from "@mui/x-data-grid";
// import { DataGrid } from "@mui/x-data-grid/DataGrid";

import { styled } from "@mui/material/styles";
import { Box, CircularProgress, Typography } from "@mui/material";
import { DefaultPaginationSettings } from "src/constants/general.const";

const CustomLoadingOverlay = () => {
  return (
    <Box
      sx={{
        height: "inherit",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

const StyledGridOverlay = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "500px",
  height: "100%",
  "& .ant-empty-img-1": {
    fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626",
  },
  "& .ant-empty-img-2": {
    fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959",
  },
  "& .ant-empty-img-3": {
    fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343",
  },
  "& .ant-empty-img-4": {
    fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
  },
  "& .ant-empty-img-5": {
    fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
    fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff",
  },
}));

const CustomNoRowsOverlay = () => {
  return (
    <StyledGridOverlay>
      <Typography
        variant="body2"
        sx={{ fontSize: "1rem", fontWeight: 600, mt: 4, alignItems: "center" }}
      >
        No Result Found
      </Typography>
      <Typography
        variant="body2"
        sx={{
          textDecoration: "none",
          fontSize: "0.875rem",
          mt: 4,
          alignItems: "center",
        }}
      >
        We couldn't found what you're looking for
      </Typography>
    </StyledGridOverlay>
  );
};

const CustomDataGrid = ({
  loading,
  handleCellClick,
  excelRowNumber,
  rowCount,
  rows,
  columns,
  fetchPageData,
  overrideConfigs,
  currentPage,
  pageSize: propsPageSize,
  sortModel: propsSortModel,
  setCurrentPage,
  setPageSize: propsSetPageSize,
  setSortModel: propsSetSortModel,
  ...restProps
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    DefaultPaginationSettings.ROWS_PER_PAGE
  );
  const [sortModel, setSortModel] = useState([
    { field: "createdAt", sort: "desc" },
  ]);

  useEffect(() => {
    if (fetchPageData) {
      fetchPageData({
        page: page,
        pageSize: pageSize,
      });
    }
  }, [page, pageSize, fetchPageData]);

  return (
    <DataGrid
      pagination
      autoHeight
      rowSelection={false}
      paginationMode="server"
      sortingMode="server"
      loading={loading}
      rowCount={rowCount}
      rows={rows}
      columns={columns}
      pageSizeOptions={DefaultPaginationSettings.ROWS_PER_PAGE_OPTIONS}
      onPageSizeChange={(newPageSize) =>
        propsSetPageSize
          ? propsSetPageSize(newPageSize)
          : setPageSize(newPageSize)
      }
      sortModel={propsSortModel ? propsSortModel : sortModel}
      onSortModelChange={(newSortModel) =>
        propsSortModel
          ? propsSetSortModel(newSortModel)
          : setSortModel(newSortModel)
      }
      paginationModel={{
        page: (setCurrentPage ? currentPage : page) - 1,
        pageSize: propsPageSize ? propsPageSize : pageSize,
      }}
      onPaginationModelChange={(newPaginationModel) => {
        if (
          newPaginationModel.page !==
          (setCurrentPage ? currentPage : page) - 1
        ) {
          setCurrentPage
            ? setCurrentPage(newPaginationModel.page + 1)
            : setPage(newPaginationModel.page + 1);
        }
        if (
          newPaginationModel.pageSize !==
          (propsPageSize ? propsPageSize : pageSize)
        ) {
          propsSetPageSize
            ? propsSetPageSize(newPaginationModel.pageSize)
            : setPageSize(newPaginationModel.pageSize);
        }
      }}
      disableColumnMenu
      disableColumnSelector
      disableColumnFilter
      disableSelectionOnClick
      getRowId={(rows) => rows._id}
      {...overrideConfigs}
      slots={{
        loadingOverlay: CustomLoadingOverlay,
        noRowsOverlay: CustomNoRowsOverlay,
      }}
      sx={{ "--DataGrid-overlayHeight": "500px" }}
      onCellClick={({ field, row }) =>
        handleCellClick && handleCellClick({ field, row })
      }
      getCellClassName={(params) => {
        if (handleCellClick && !["Actions"].includes(params.field))
          return "cursor-pointer";
        return "";
      }}
    />
  );
};

export default CustomDataGrid;
