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
import { Button, Dialog, DialogContent, DialogTitle, Table } from '@mui/material';
import { EditUserModal } from 'src/components/User';
import { AppContext } from 'src/context/app.context';
import { fDate } from 'src/utils/format-time';
import LockUserModal from 'src/components/User/LockUser';
import DeleteUserModal from 'src/components/User/DeleteUserForm';

// ----------------------------------------------------------------------

export default function UserTableRow({
  id,
  selected,
  firstName,
  lastName,
  avatar,
  email,
  role,
  verify,
  deleted,
  address,
  phoneNumber,
  createdAt,
  handleClick,
  sex,
  queryUserList,
}) {
  const [open, setOpen] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openBanModal, setOpenBanModal] = useState(false);
  const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const { profile } = useContext(AppContext);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleCloseEditModal = () => {
    setOpen(null);
    setOpenEditModal(false);
  };

  const handleCloseBanModal = () => {
    setOpen(null);
    setOpenBanModal(false);
  };

  const handleCloseDeleteUserModal = () => {
    setOpen(null);
    setOpenDeleteUserModal(false);
  };

  const handleEditButtonClick = () => {
    setOpen(null);
    setSelectedUser({
      id,
      firstName,
      lastName,
      avatar,
      email,
      role,
      verify,
      deleted,
      address,
      phoneNumber,
      createdAt,
      sex,
    });
    setOpenEditModal(true);
  };

  const fullName = firstName + ' ' + lastName;

  const handleBanButtonClick = () => {
    setOpen(null);
    setSelectedUser({
      id,
      email,
      fullName,
      deleted,
    });
    setOpenBanModal(true);
  };

  const handleDeleteButtonClick = () => {
    setOpen(null);
    setSelectedUser({
      id,
      email,
      fullName,
      deleted,
    });
    setOpenDeleteUserModal(true);
  };

  const roleCus = role === Role.ADMIN ? Role.ADMIN : Role.USER;

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          {profile.id !== id && (
            <Checkbox disableRipple checked={selected} onChange={handleClick} />
          )}
        </TableCell>
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
        <TableCell>{fDate(createdAt)}</TableCell>
        <TableCell>{roleCus.charAt(0).toUpperCase() + roleCus.slice(1).toLowerCase()}</TableCell>
        <TableCell align="center">{verify === Verify.VERIFY ? 'Yes' : 'No'}</TableCell>
        <TableCell>
          <Label color={(deleted === true && 'error') || 'success'}>
            {deleted ? Status.LOCKED : Status.ACTIVE}
          </Label>
        </TableCell>

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
        <MenuItem onClick={handleEditButtonClick}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleBanButtonClick}>
          {deleted ? (
            <>
              <Iconify icon="eva:unlock-fill" sx={{ mr: 2 }} />
              Unlock
            </>
          ) : (
            <>
              <Iconify icon="eva:lock-fill" sx={{ mr: 2 }} />
              Lock
            </>
          )}
        </MenuItem>

        <MenuItem onClick={handleDeleteButtonClick} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      <EditUserModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        user={selectedUser}
        queryUserList={queryUserList}
      />

      <LockUserModal
        open={openBanModal}
        onClose={handleCloseBanModal}
        user={selectedUser}
        queryUserList={queryUserList}
      />

      <DeleteUserModal
        open={openDeleteUserModal}
        onClose={handleCloseDeleteUserModal}
        user={selectedUser}
        queryUserList={queryUserList}
      />
    </>
  );
}

UserTableRow.propTypes = {
  id: PropTypes.any.isRequired,
  avatar: PropTypes.any,
  email: PropTypes.any,
  handleClick: PropTypes.func,
  verify: PropTypes.any,
  firstName: PropTypes.any,
  lastName: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  deleted: PropTypes.bool,
  createdAt: PropTypes.any,
  queryUserList: PropTypes.any,
  address: PropTypes.string,
  phoneNumber: PropTypes.string,
  sex: PropTypes.string,
};
