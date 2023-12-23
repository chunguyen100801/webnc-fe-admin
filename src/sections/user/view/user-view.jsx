/* eslint-disable prefer-template */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable import/order */
/* eslint-disable no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { fDate } from 'src/utils/format-time';

import { users } from 'src/_mock/user';
import userApi from 'src/apis/user.api';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { Button } from '@mui/material';
import Iconify from 'src/components/iconify';
import { NewUserForm } from 'src/components/User';
import { debounce } from 'lodash';

// ----------------------------------------------------------------------

export default function UserView() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('registrationTime');

  const [filterName, setFilterName] = useState(' ');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [toleUsers, setToleUsers] = useState(0);

  const queryUserList = {
    order,
    page: page + 1,
    take: rowsPerPage,
    search: filterName,
  };

  const userData = useQuery({
    queryKey: ['list-users', queryUserList],
    queryFn: () => userApi.getListUsers(queryUserList),
  });

  const usersList = userData.data?.data?.data;
  console.log(usersList);

  useEffect(() => {
    userData.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, order, filterName, page]);

  useEffect(() => {
    if (userData.isSuccess) {
      setToleUsers(usersList?.meta?.itemCount);
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = usersList?.data?.map((n) => n.email);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, email) => {
    const selectedIndex = selected.indexOf(email);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, email);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
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
    console.log(valueSearch);
  }, 500);

  const dataFiltered = applyFilter({
    inputData: usersList?.data,
    comparator: getComparator(order, orderBy),
  });

  const [openNewUserModal, setOpenNewUserModal] = useState(false);

  const handleCloseNewUserModal = () => {
    setOpenNewUserModal(false);
  };

  const notFound = !userData.isLoading && !dataFiltered?.length && filterName !== ' ';

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3} mb={3}>
        <Typography variant="h4" className="text-blue-500">
          Users
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => setOpenNewUserModal(true)}
        >
          New User
        </Button>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={usersList?.data?.length || 0}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'firstName', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'registrationTime', label: 'Registration time' },
                  { id: 'role', label: 'Role' },
                  { id: 'isVerified', label: 'Verified', align: 'center' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered?.map((row) => (
                  <UserTableRow
                    key={row.id}
                    name={`${row?.firstName} ${row?.lastName}`}
                    role={row?.role}
                    registionTime={fDate(row?.createdAt)}
                    status={row?.status}
                    email={row?.email}
                    avatarUrl={row?.avatar}
                    isVerified={row?.verify}
                    selected={selected.indexOf(row?.email) !== -1}
                    handleClick={(event) => handleClick(event, row?.email)}
                  />
                ))}
                {!notFound ? (
                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(
                      page,
                      rowsPerPage,
                      usersList?.meta?.itemCount || toleUsers
                    )}
                  />
                ) : (
                  <TableNoData query={filterName} />
                )}
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
      <NewUserForm
        open={openNewUserModal}
        onClose={handleCloseNewUserModal}
        order={order}
        page={page}
        rowsPerPage={rowsPerPage}
        // Pass any necessary props or callback functions
      />
    </Container>
  );
}
