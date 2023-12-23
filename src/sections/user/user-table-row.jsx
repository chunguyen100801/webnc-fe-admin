/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
/* eslint-disable no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable prefer-template */
import { useState } from 'react';
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

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  name,
  avatarUrl,
  email,
  role,
  isVerified,
  status,
  registionTime,
  handleClick,
}) {
  const [open, setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleCloseModal = () => {
    setOpen(null);
    setOpenModal(false);
  };

  const handleEditButtonClick = () => {
    setOpen(null);
    setSelectedUser({
      name,
      email,
      role,
      avatarUrl,
      isVerified,
      status,
      registionTime,
    });
    setOpenModal(true);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl}>
              {name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>{registionTime}</TableCell>

        <TableCell>
          {(role || Role.USER).charAt(0).toUpperCase() + (role || Role.USER).slice(1).toLowerCase()}
        </TableCell>

        <TableCell align="center">{isVerified === Verify.VERIFY ? 'Yes' : 'No'}</TableCell>

        <TableCell>
          <Label color={(status === 'banned' && 'error') || 'success'}>
            {(status || Status.ACTIVE).charAt(0).toUpperCase() +
              (status || Status.ACTIVE).slice(1).toLowerCase()}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
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
        {status === Status.BLOCKED ? (
          <MenuItem onClick={handleCloseMenu}>
            <Iconify icon="eva:unlock-fill" sx={{ mr: 2 }} />
            Unlock
          </MenuItem>
        ) : (
          <MenuItem onClick={handleCloseMenu}>
            <Iconify icon="eva:lock-fill" sx={{ mr: 2 }} />
            Lock
          </MenuItem>
        )}

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      <EditUserModal open={openModal} onClose={handleCloseModal} user={selectedUser} />
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  email: PropTypes.any,
  handleClick: PropTypes.func,
  isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
  registionTime: PropTypes.any,
};
