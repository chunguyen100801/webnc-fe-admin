/* eslint-disable perfectionist/sort-named-imports */
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

import { fDate } from 'src/utils/format-time';

import memberApi from 'src/apis/member.api';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import MemberTableRow from '../member-table-row';
import MemberTableHead from '../member-table-head';

import { emptyRows, applyFilter } from '../utils';
import { Box, Button, CircularProgress, Toolbar } from '@mui/material';
import Iconify from 'src/components/iconify';

import { debounce } from 'lodash';
import { AppContext } from 'src/context/app.context';
import MemberTableToolbar from '../member-table-toolbar';
import TableEmptyRows from '../../table-empty-rows';
import { useNavigate, useParams } from 'react-router-dom';
import { Role } from 'src/constants/const';
import path from 'src/constants/path';

// ----------------------------------------------------------------------

export default function MemberView() {
  const params = useParams();
  const navigate = useNavigate();

  const classId = params?.classId;

  const [filterName, setFilterName] = useState(' ');

  const { profile } = useContext(AppContext);

  const memberData = useQuery({
    queryKey: ['list-member'],
    queryFn: () => memberApi.getMemberList(classId),
  });

  const membersList = memberData.data?.data?.data[0];
  const createdById = membersList?.createdById;

  useEffect(() => {
    if (memberData.isError) {
      navigate(path.class);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberData]);

  const handleFilterByName = debounce((event) => {
    const valueSearch = ' ' + event.target.value.trim();
    setFilterName(valueSearch);
  }, 500);

  const dataFilteredTeacher = applyFilter({
    inputData: membersList?.courseTeachers,
    myId: profile.id,
  });

  const dataFilteredStudent = applyFilter({
    inputData: membersList?.enrollments,
    myId: profile.id,
  });

  const notFound = !memberData.isLoading && !dataFilteredTeacher?.length && filterName !== ' ';

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3} mb={3}>
        <Typography variant="h4" className="text-blue-500">
          {membersList?.name}
        </Typography>
      </Stack>

      <Card sx={{ marginBottom: 3 }}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: memberData.isLoading ? 'flex' : 'none', // Hiển thị khi isLoading là true
          }}
        >
          <CircularProgress />
        </Box>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Toolbar
              sx={{
                height: 96,
                display: 'flex',
                flexDirection: { xs: 'column-reverse', sm: 'row' },
                justifyContent: 'space-between',
                marginY: { xs: 2, sm: 0 },
                fontSize: 25,
                fontWeight: 'bold',
              }}
            >
              <div>Teacher</div>
              <Typography component="div" variant="subtitle1" sx={{ verticalAlign: 'middle' }}>
                {membersList?.courseTeachers?.length || 0} teachers
              </Typography>
            </Toolbar>
            <Table sx={{ minWidth: 800 }}>
              <MemberTableHead
                headLabel={[
                  { id: 'number', label: '#' },
                  { id: 'firstName', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'joinAt', label: 'Join at' },
                  { id: '' },
                ]}
              />

              <TableBody>
                {memberData.isLoading && <TableEmptyRows height={68} emptyRows={3} />}
                {dataFilteredTeacher?.map((row, index) => (
                  <MemberTableRow
                    index={index}
                    key={row?.teacher?.id}
                    id={row?.teacher?.id}
                    firstName={row?.teacher?.firstName}
                    lastName={row?.teacher?.lastName}
                    role={Role.TEACHER}
                    deleted={row?.teacher?.deleted}
                    email={row?.teacher?.email}
                    avatar={row?.teacher?.avatar}
                    createdAt={row?.teacher?.createdAt}
                    createdById={createdById}
                  />
                ))}

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>

      <Card>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: memberData.isLoading ? 'flex' : 'none', // Hiển thị khi isLoading là true
          }}
        >
          <CircularProgress />
        </Box>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Toolbar
              sx={{
                height: 96,
                display: 'flex',
                flexDirection: { xs: 'column-reverse', sm: 'row' },
                justifyContent: 'space-between',
                marginY: { xs: 2, sm: 0 },
                fontSize: 25,
                fontWeight: 'bold',
              }}
            >
              <div>Student</div>
              <Typography component="div" variant="subtitle1" sx={{ verticalAlign: 'middle' }}>
                {membersList?.enrollments?.length || 0} students
              </Typography>
            </Toolbar>
            <Table sx={{ minWidth: 800 }}>
              <MemberTableHead
                headLabel={[
                  { id: 'number', label: '#' },
                  { id: 'studentId', label: 'Student ID' },
                  { id: 'firstName', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'joinAt', label: 'Join at' },
                  { id: '' },
                ]}
              />

              <TableBody>
                {memberData.isLoading && <TableEmptyRows height={68} emptyRows={3} />}
                {dataFilteredStudent?.map((row, index) => (
                  <MemberTableRow
                    index={index}
                    key={row?.student?.id}
                    id={row?.student.id}
                    studentId={row?.studentId}
                    firstName={row?.student.firstName}
                    lastName={row?.student.lastName}
                    role={Role.STUDENT}
                    email={row?.student.email}
                    avatar={row?.student.avatar}
                    createdAt={row?.student?.createdAt}
                  />
                ))}

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
    </Container>
  );
}
