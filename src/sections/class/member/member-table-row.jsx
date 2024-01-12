/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
/* eslint-disable no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable prefer-template */
import { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
// import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
// import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';

import { Role, Status, Verify } from 'src/constants/const';

// import Label from 'src/components/label';
// import Iconify from 'src/components/iconify';
import { Button, Dialog, DialogContent, DialogTitle, Table } from '@mui/material';
import { AppContext } from 'src/context/app.context';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function MemberTableRow({
  index,
  id,
  firstName,
  lastName,
  avatar,
  email,
  role,
  createdAt,
  createdById,
  studentId,
}) {
  // const [open, setOpen] = useState(null);
  // const [openEditModal, setOpenEditModal] = useState(false);

  // const [selectedMember, setSelectedMember] = useState(null);

  // const { profile } = useContext(AppContext);

  // const handleOpenMenu = (event) => {
  //   setOpen(event.currentTarget);
  // };

  // const handleCloseMenu = () => {
  //   setOpen(null);
  // };

  // const handleCloseEditModal = () => {
  //   setOpen(null);
  //   // setOpenEditModal(false);
  // };

  // const handleEditButtonClick = () => {
  //   setOpen(null);
  //   setSelectedMember({
  //     id,
  //     firstName,
  //     lastName,
  //     avatar,
  //     email,
  //     role,
  //     createdAt,
  //     studentId,
  //   });
  //   setOpenEditModal(true);
  // };

  const fullName = firstName + ' ' + lastName;

  const roleCus = role === Role.ADMIN ? Role.ADMIN : Role.USER;

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell component="th">{index + 1}</TableCell>
        {role === Role.STUDENT && <TableCell>{studentId}</TableCell>}
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
        {/* 
        {role === Role.STUDENT ? (
          <TableCell align="right">
            <IconButton onClick={handleOpenMenu}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        ) : (
          <TableCell height={68}>{id === createdById && 'Owner'} </TableCell>
        )} */}
      </TableRow>

      {/* {role === Role.STUDENT && (
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
            Student Id
          </MenuItem>
        </Popover>
      )} */}

      {/* <EditMemberModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        member={selectedMember}
        setSelectedMember={setSelectedMember}
      /> */}
    </>
  );
}

MemberTableRow.propTypes = {
  id: PropTypes.any.isRequired,
  avatar: PropTypes.any,
  email: PropTypes.any,
  firstName: PropTypes.any,
  lastName: PropTypes.any,
  role: PropTypes.any,
  createdAt: PropTypes.any,
  index: PropTypes.number,
  createdById: PropTypes.any,
  studentId: PropTypes.any,
};
