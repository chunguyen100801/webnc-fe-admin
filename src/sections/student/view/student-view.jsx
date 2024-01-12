/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable prefer-template */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable import/order */
/* eslint-disable no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
// eslint-disable-next-line perfectionist/sort-named-imports
import { useState, useEffect, useContext, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import userApi from 'src/apis/user.api';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { Box, Button, CircularProgress } from '@mui/material';
import Iconify from 'src/components/iconify';
import { NewUserForm } from 'src/components/User';
import { debounce } from 'lodash';
import { AppContext } from 'src/context/app.context';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CSVLink } from 'react-csv';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { uploadStudentIdArray } from 'src/utils/rules';
import { toast } from 'react-toastify';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as XLSX from 'xlsx';
// ----------------------------------------------------------------------

const headers = [
  { label: 'STT', key: 'details.stt' },
  { label: 'StudentId', key: 'details.studentId' },
  { label: 'Email', key: 'details.email' },
];
export default function StudentView() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('firstName');

  const [filterName, setFilterName] = useState(' ');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [toleUsers, setToleUsers] = useState(0);
  const fileInputRef = useRef();
  const handleUpload = () => {
    fileInputRef.current?.click();
    fileInputRef.current.value = null;
  };
  // const [rowCount, setRowCount] = useState(0);
  const rowCountRef = useRef(0);

  const { profile } = useContext(AppContext);

  const queryUserList = {
    order,
    page: page + 1,
    take: rowsPerPage,
    search: filterName,
  };

  const userData = useQuery({
    queryKey: ['list-users-not-admin', queryUserList],
    queryFn: () => userApi.getListUserNotAdmin(queryUserList),
  });

  const usersList = userData.data?.data?.data;
  const userCount = usersList?.data?.length;

  useEffect(() => {
    userData.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, order, filterName, page]);

  useEffect(() => {
    if (userData.isSuccess) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      rowCountRef.current = userCount;
      setToleUsers(usersList?.meta?.itemCount);
    }
    if (userCount === 0 && page > 0) {
      setPage(page - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = debounce((event) => {
    const valueSearch = ' ' + event.target.value.trim();
    setPage(0);
    setFilterName(valueSearch);
  }, 500);

  const dataFiltered = applyFilter({
    inputData: usersList?.data,
    comparator: getComparator(order, orderBy),
    myId: profile.id,
  });

  const notFound = !userData.isLoading && !dataFiltered?.length && filterName !== ' ';

  const {
    formState: { errors },
  } = useForm({
    resolver: zodResolver(uploadStudentIdArray),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (body) => userApi.mapStudentIdList(body),
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.files = null;
    console.log(file);

    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension !== 'csv' && fileExtension !== 'xlsx') {
      toast.error('Please upload a CSV or XLSX file.');
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Lấy dữ liệu từ sheet đầu tiên
        const firstSheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
        if (sheetData.length < 1) {
          toast.warning('File is empty!');
          return;
        }
        const keys = Object.keys(sheetData[0]);

        if (!keys.includes(headers[1].label)) {
          toast.error('StudentId field is missing!');
          return;
        }

        if (!keys.includes(headers[2].label)) {
          toast.error('Email field is missing!');
          return;
        }

        const sheetDataWithoutStt = sheetData.map(({ STT, StudentId, ...rest }) => ({
          ...rest,
          StudentId: String(StudentId),
        }));
        try {
          uploadStudentIdArray.parse(sheetDataWithoutStt);
        } catch (error) {
          toast.error(error.errors.join(', '));
        }
        await updateProfileMutation.mutate(sheetDataWithoutStt, {
          onSuccess: async (res) => {
            await userData.refetch();
            toast.success(res.data.message);
            // await queryClient.invalidateQueries({
            //   queryKey: ['list-users', queryUserList],
            // });
            // reset();
            // onClose();
          },
        });
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3} mb={3}>
        <Typography variant="h4" className="text-blue-500">
          Users
        </Typography>
        <Stack direction="row">
          <input
            type="file"
            id="upload-file"
            hidden
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="hidden"
          />
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="material-symbols:upload" />}
            onClick={handleUpload}
            sx={{
              marginRight: '1rem',
              backgroundColor: 'white',
              color: 'black',
              border: '1px solid black',
            }}
          >
            Upload
          </Button>
          <CSVLink data={[]} filename="studentId-template.csv" headers={headers}>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="material-symbols:download" />}
              sx={{ backgroundColor: 'black', color: 'white' }}
            >
              Download
            </Button>
          </CSVLink>
        </Stack>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          selected={selected}
          setPage={setPage}
          setFilterName={setFilterName}
          queryUserList={queryUserList}
          setSelected={setSelected}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: userData.isLoading || updateProfileMutation.isPending ? 'flex' : 'none', // Hiển thị khi isLoading là true
          }}
        >
          <CircularProgress />
        </Box>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={rowCountRef.current}
                numSelected={selected.length}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'studentId', label: 'Student ID', align: 'center' },
                  { id: 'firstName', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'countClass', label: 'Class count', align: 'center' },
                  { id: '' },
                ]}
              />

              <TableBody>
                {(userData.isLoading || updateProfileMutation.isPending) && (
                  <TableEmptyRows height={68} emptyRows={rowsPerPage} />
                )}
                {!updateProfileMutation.isPending &&
                  dataFiltered?.map((row) => (
                    <UserTableRow
                      key={row?.id}
                      id={row?.id}
                      firstName={row?.firstName}
                      lastName={row?.lastName}
                      email={row?.email}
                      avatar={row?.avatar}
                      selected={selected.indexOf(row?.id) !== -1}
                      queryUserList={queryUserList}
                      studentId={row?.studentId}
                      classCount={row?.studentEnrollments?.length}
                    />
                  ))}

                {!userData.isLoading && rowsPerPage < toleUsers && (
                  <TableEmptyRows
                    height={68}
                    emptyRows={emptyRows(page, rowsPerPage, usersList?.meta?.itemCount || 0)}
                  />
                )}
                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={usersList?.meta?.itemCount || toleUsers}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
