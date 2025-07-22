import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import CustomDataGrid from 'src/@core/components/data-grid'
import moment from 'moment'

const TableSubAdmin = ({
  rows,
  totalCount,
  setCurrentPage,
  currentPage,
  setPageSize,
  pageSize,
  loading,
  toggleEdit,
  toggleDelete
}) => {
  return (
    <CustomDataGrid
      loading={loading}
      rowCount={totalCount}
      rows={rows}
      columns={[
        {
          field: 'name',
          minWidth: 300,
          flex: 1,
          sortable: false,
          headerName: 'Name',
          renderCell: ({ row }) => (
            <Typography noWrap variant='body2' title={row.name}>
              {row.name}
            </Typography>
          )
        },

        {
          field: 'Actions',
          flex: 0,
          minWidth: 150,
          sortable: false,
          headerName: 'Actions',
          renderCell: ({ row }) => (
            <Box display='flex' alignItems='center' gap='10px' style={{ marginTop: "-7px" }}>
              <IconButton size='small' color='primary' variant='outlined' onClick={e => toggleEdit(e, 'edit', row)}>
                <EditIcon />
              </IconButton>
              <IconButton size='small' color='primary' onClick={e => toggleDelete(e, row)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )
        }
      ]}
      currentPage={currentPage}
      pageSize={pageSize}
      setCurrentPage={setCurrentPage}
      setPageSize={setPageSize}
    />
  )
}

export default TableSubAdmin
