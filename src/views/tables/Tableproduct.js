import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import CustomDataGrid from 'src/@core/components/data-grid'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import moment from 'moment'

function Tableproduct({
  rows,
  totalCount,
  setCurrentPage,
  currentPage,
  setPageSize,
  pageSize,
  loading,
  toggleEdit,
  toggleDelete
}) {
  const statusColors = {
    inactive: "#FFB400",
    active: "#66bb6a",
    pending: "#FF5722",
  };
  const CustomChip = styled(Chip)(({ label }) => ({
    backgroundColor: statusColors[label] || statusColors.default,
    textTransform: 'capitalize',
    color: '#fff',
    width: '100px'
  }))

  return (
    <CustomDataGrid
      loading={loading}
      rowCount={totalCount}
      rows={rows}
      columns={[
        // {
        //   field: '_id',
        //   minWidth: 150,
        //   sortable: false,
        //   headerName: '_id',
        //   renderCell: ({ row }) => (
        //     <Typography noWrap variant='body2' title={row.author}>
        //       {row.author}
        //     </Typography>
        //   )
        // },
        {
          field: 'name',
          minWidth: 150,
          sortable: false,
          headerName: 'Name',
          renderCell: ({ row }) => (
            <Typography noWrap variant='body2' title={row.name}>
              {row.name}
            </Typography>
          )
        },
        {
          field: 'brand',
          minWidth: 150,
          sortable: false,
          headerName: 'Brand',
          renderCell: ({ row }) => (
            <Typography noWrap variant='body2' title={row.brand}>
              {row.brand}
            </Typography>
          )
        },
        {
          field: 'price',
          minWidth: 150,
          sortable: false,
          headerName: 'Price',
          renderCell: ({ row }) => (
            <Typography noWrap variant='body2' title={row.price}>
              {row.price}
            </Typography>
          )
        },
        {
          field: 'msrp',
          minWidth: 150,
          sortable: false,
          headerName: 'MSRP',
          renderCell: ({ row }) => (
            <Typography noWrap variant='body2' title={row.msrp}>
              {row.msrp}
            </Typography>
          )
        },
        {
          field: 'description',
          minWidth: 400,
          sortable: false,
          headerName: 'Description',
          renderCell: ({ row }) => (
            <Typography noWrap variant='body2' title={row.description}>
              <div
                className='career_____content'
                dangerouslySetInnerHTML={{
                  __html: row.description
                }}
              />
            </Typography>
          )
        },
     
        // {
        //   field: 'image',
        //   flex: 0.1,
        //   minWidth: 150,
        //   sortable: false,
        //   headerName: 'Image',
        //   renderCell: ({ row }) => (
        //     // <img alt='' src={`${MEDIA_URL}${row.image}`} style={{ height: '30px', width: '50px' }} />
        //     <img alt='' src={row.image} style={{ height: '30px', width: '50px' }} />
        //   )
        // },

        {
          field: 'updatedAt',
          minWidth: 200,
          flex: 0.5,
          sortable: false,
          headerName: 'createdAt ',
          renderCell: ({ row }) => (
            <Typography noWrap variant='body2' title={row.updatedAt}>
              {moment(row.updatedAt).format('DD-MM-YYYY HH:MM')}
            </Typography>
          )
        },
        {
          field: 'status',
          minWidth: 180,
          sortable: false,
          headerName: 'Status',
          renderCell: ({ row }) => <CustomChip label={row.status} />
        },
 
        {
          field: "Actions",
          flex: 0.1,
          minWidth: 170,
          sortable: false,
          headerName: "Actions",
          renderCell: ({ row }) => (
            <Box display="flex" alignItems="center" gap="10px">
              <IconButton
                size="small"
                color="primary"
                variant="outlined"
                onClick={(e) => toggleEdit(e, "edit", row)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="primary"
                onClick={(e) => toggleDelete(e, row)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ),
        },
      ]}
      currentPage={currentPage}
      pageSize={pageSize}
      setCurrentPage={setCurrentPage}
      setPageSize={setPageSize}
    />
  )
}

export default Tableproduct
