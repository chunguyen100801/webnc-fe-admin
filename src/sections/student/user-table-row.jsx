/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
/* eslint-disable no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable prefer-template */
import { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Role, Status, Verify } from 'src/constants/const';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { EditUserModal } from 'src/components/User';
import { AppContext } from 'src/context/app.context';
import { fDate } from 'src/utils/format-time';
import LockUserModal from 'src/components/User/LockUser';
import DeleteUserModal from 'src/components/User/DeleteUserForm';
import EditStudentIDModal from 'src/components/User/EditStudentIDModal';

// ----------------------------------------------------------------------

export default function UserTableRow({
  id,
  selected,
  firstName,
  lastName,
  avatar,
  email,
  queryUserList,
  studentId,
  classCount,
}) {
  const [open, setOpen] = useState(null);
  const [openEditStudentIDModal, setOpenEditStudentIDModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const { profile } = useContext(AppContext);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleCloseEditStudentIDModal = () => {
    setOpen(null);
    setOpenEditStudentIDModal(false);
  };

  const handleEditStudentIdButtonClick = () => {
    setOpen(null);
    setSelectedUser({
      id,
      email,
      studentId,
    });
    setOpenEditStudentIDModal(true);
  };

  const fullName = firstName + ' ' + lastName;

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell sx={{ paddingLeft: '3rem' }}>{studentId}</TableCell>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={fullName} src={avatar}>
              {fullName.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle2" noWrap>
              {fullName}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{email}</TableCell>
        <TableCell align="center">{classCount}</TableCell>

        {profile.id !== id ? (
          <TableCell align="right">
            <IconButton onClick={handleOpenMenu}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        ) : (
          <TableCell height={68}> </TableCell>
        )}
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleEditStudentIdButtonClick}>
          <Iconify icon="teenyicons:id-outline" sx={{ mr: 2 }} />
          Student Id
        </MenuItem>
      </Popover>

      <EditStudentIDModal
        open={openEditStudentIDModal}
        onClose={handleCloseEditStudentIDModal}
        member={selectedUser}
        setSelectedMember={setSelectedUser}
      />
    </>
  );
}

UserTableRow.propTypes = {
  id: PropTypes.any.isRequired,
  avatar: PropTypes.any,
  email: PropTypes.any,
  firstName: PropTypes.any,
  lastName: PropTypes.any,
  selected: PropTypes.any,
  queryUserList: PropTypes.any,
  studentId: PropTypes.string,
  classCount: PropTypes.any,
};
