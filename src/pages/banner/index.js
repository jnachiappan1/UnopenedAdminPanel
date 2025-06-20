import { useEffect, useState, useRef, useCallback } from 'react'
import { Button, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import PageHeader from '../../@core/components/page-header/index'
import Translations from '../../layouts/components/Translations'
import { axiosInstance } from '../../network/adapter'
import { ApiEndPoints } from '../../network/endpoints'
import { DefaultPaginationSettings } from '../../constants/general.const'
import { toastError, toastSuccess } from '../../utils/utils'
import DialogConfirmation from '../../views/dialogs/DialogConfirmation'
import TableBanner from 'src/views/tables/TabelBanner'
import DialogBanner from 'src/views/dialogs/DialogBanner'
import Grid from "@mui/material/Grid2"

const BannerPage  = () => {
    const searchTimeoutRef = useRef()
    const [loading, setLoading] = useState(false)
    const [careerData, setcareerData] = useState([])
    const [search, setSearch] = useState('')
    const [totalCount, setTotalCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1) 
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE)
    const [bannerFormDialogOpen, setBannerFormDialogOpen] = useState(false)
    const [bannerFormDialogMode, setBannerFormDialogMode] = useState('add')
    const [bannerToEdit, setBannerToEdit] = useState(null)

    const togglebannerFormDialog = (e, mode = 'add', bannerToEdit = null) => {
        setBannerFormDialogOpen(prev => !prev)
        setBannerFormDialogMode(mode)
        setBannerToEdit(bannerToEdit)
    }

    // Confirmation
    const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false)
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
    const [careerToDelete, setcareerToDelete] = useState(null)

    const toggleConfirmationDialog = (e, dataToDelete = null) => {
        setConfirmationDialogOpen(prev => !prev)
        setcareerToDelete(dataToDelete)
    }

    const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true)
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search
        }
        axiosInstance
            .get(ApiEndPoints.BANNER.list, { params })
            .then(response => {
                setcareerData(response.data.data.banner)                
                setTotalCount(response.data.data.totalCount)
            })
            .catch(error => {
                toastError(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchData({
            currentPage: currentPage,
            pageSize: pageSize,
            search: search
        })
    }, [currentPage, pageSize, search])

    const handleSearchChange = e => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(() => {
            setSearch(e.target.value)
        }, 500)
    }
    
    return (
        <>
            <Grid container spacing={4} className='match-height'>
                <PageHeader
                    title={
                        <Typography variant='h5'>
                            <Translations text='Banner' />
                        </Typography>
                    }
                    // action={
                    //     <Button variant='contained'  onClick={togglegalleryFormDialog}>
                    //         Add  Gallery
                    //     </Button>
                    // }
                />
                <Grid item size={{ xs: 12 }}>
                    <Card>
                        <Box
                            sx={{
                                p: 5,
                                pb: 0,
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Box></Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                <TextField type='search' size='small' placeholder='Search' onChange={handleSearchChange} />
                            </Box>
                        </Box>
                        <Box sx={{ p: 5 }}>
                            <TableBanner
                                search={search}
                                loading={loading}
                                rows={careerData}
                                totalCount={totalCount}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                setPageSize={setPageSize}
                                pageSize={pageSize}
                                toggleEdit={togglebannerFormDialog}
                                toggleDelete={toggleConfirmationDialog}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>
            <DialogBanner
                mode={bannerFormDialogMode}
                open={bannerFormDialogOpen}
                toggle={togglebannerFormDialog}
                dataToEdit={bannerToEdit}
                onSuccess={() => {
                    fetchData({
                        currentPage: currentPage,
                        pageSize: pageSize
                    })
                }}
            />
            <DialogConfirmation
                loading={confirmationDialogLoading}
                title='Delete Gallery'
                subtitle='Are you sure you want to delete this Gallery?'
                open={confirmationDialogOpen}
                toggle={toggleConfirmationDialog}
                // onConfirm={onConfirmDelete}
            />
        </>
    )
}


export default BannerPage;