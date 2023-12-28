/* eslint-disable prefer-template */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable import/order */
/* eslint-disable no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
// eslint-disable-next-line perfectionist/sort-named-imports
import { useState, useEffect, useContext, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import classApi from 'src/apis/class.api';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import ClassTableRow from '../class-table-row';
import ClassTableHead from '../class-table-head';
import TableEmptyRows from '../table-empty-rows';
import ClassTableToolbar from '../class-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { Box, Button, CircularProgress } from '@mui/material';
import { debounce } from 'lodash';
import { AppContext } from 'src/context/app.context';

// ----------------------------------------------------------------------

export default function ClassView() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('registrationTime');

  const [filterName, setFilterName] = useState(' ');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [toleClasses, setToleClasses] = useState(0);

  // const [rowCount, setRowCount] = useState(0);

  const { profile } = useContext(AppContext);

  const queryClassList = {
    order,
    page: page + 1,
    take: rowsPerPage,
    search: filterName,
  };

  const classData = useQuery({
    queryKey: ['list-classes', queryClassList],
    queryFn: () => classApi.getListClasses(queryClassList),
  });

  const classesList = classData.data?.data?.data;
  const classCount = classesList?.data?.length;

  useEffect(() => {
    classData.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, order, filterName, page]);

  useEffect(() => {
    if (classData.isSuccess) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setToleClasses(classesList?.meta?.itemCount);
    }
    if (classCount === 0 && page > 0) {
      setPage(page - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classData]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = classesList?.data?.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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
  }, 500);

  const dataFiltered = applyFilter({
    inputData: classesList?.data,
    comparator: getComparator(order, orderBy),
    myId: profile.id,
  });

  const [openNewClassModal, setOpenNewClassModal] = useState(false);

  const handleCloseNewClassModal = () => {
    setOpenNewClassModal(false);
  };

  const notFound = !classData.isLoading && !dataFiltered?.length && filterName !== ' ';

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3} mb={3}>
        <Typography variant="h4" className="text-blue-500">
          Classes
        </Typography>
      </Stack>

      <Card>
        <ClassTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          selected={selected}
          setPage={setPage}
          setFilterName={setFilterName}
          queryClassList={queryClassList}
          setSelected={setSelected}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: classData.isLoading ? 'flex' : 'none', // Hiển thị khi isLoading là true
          }}
        >
          <CircularProgress />
        </Box>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ClassTableHead
                order={order}
                orderBy={orderBy}
                rowCount={classCount}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Class name' },
                  { id: 'code', label: 'Code' },
                  { id: 'topic', label: 'Topic' },
                  { id: 'room', label: 'Room', align: 'center' },
                  { id: 'member', label: 'Members', align: 'center' },
                  { id: 'owner', label: 'Owner' },
                  { id: 'creationTime', label: 'Creation time', align: 'center' },
                  { id: '' },
                ]}
              />

              <TableBody>
                {classData.isLoading && <TableEmptyRows height={68} emptyRows={rowsPerPage} />}
                {dataFiltered?.map((row) => (
                  <ClassTableRow
                    key={row.id}
                    id={row.id}
                    name={row?.name}
                    createdAt={row?.createdAt}
                    avatar={row?.avatar}
                    code={row?.code}
                    topic={row?.topic}
                    room={row?.room}
                    courseTeachers={row?.courseTeachers}
                    enrollments={row?.enrollments}
                    description={row?.description}
                    selected={selected.indexOf(row?.id) !== -1}
                    handleClick={(event) => handleClick(event, row?.id)}
                    queryClassList={queryClassList}
                    createdBy={row?.createdBy}
                  />
                ))}

                {!classData.isLoading && rowsPerPage < toleClasses && (
                  <TableEmptyRows
                    height={68}
                    emptyRows={emptyRows(page, rowsPerPage, classesList?.meta?.itemCount || 0)}
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
          count={classesList?.meta?.itemCount || toleClasses}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
