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
// import { EditClassModal } from 'src/components/Class';
import { AppContext } from 'src/context/app.context';
import { fDate } from 'src/utils/format-time';
// import LockClassModal from 'src/components/Class/LockClass';
// import DeleteClassModal from 'src/components/Class/DeleteClassForm';

// ----------------------------------------------------------------------

export default function ClassTableRow({
  id,
  name,
  createdAt,
  avatar,
  code,
  topic,
  room,
  description,
  selected,
  handleClick,
  queryClassList,
}) {
  const [open, setOpen] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openBanModal, setOpenBanModal] = useState(false);
  const [openDeleteClassModal, setOpenDeleteClassModal] = useState(false);

  const [selectedClass, setSelectedClass] = useState(null);

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

  const handleCloseDeleteClassModal = () => {
    setOpen(null);
    setOpenDeleteClassModal(false);
  };

  const handleEditButtonClick = () => {
    setOpen(null);
    setSelectedClass({});
    setOpenEditModal(true);
  };

  const handleBanButtonClick = () => {
    setOpen(null);
    setSelectedClass({});
    setOpenBanModal(true);
  };

  const handleDeleteButtonClick = () => {
    setOpen(null);
    setSelectedClass({});
    setOpenDeleteClassModal(true);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatar}>
              {name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{code}</TableCell>
        <TableCell>{topic}</TableCell>
        <TableCell align="center">{room}</TableCell>
        <TableCell align="center">{fDate(createdAt)}</TableCell>

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

        <MenuItem onClick={handleBanButtonClick}>
          <Iconify icon="eva:unlock-fill" sx={{ mr: 2 }} />
          Members
        </MenuItem>

        <MenuItem onClick={handleDeleteButtonClick} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      {/* <EditClassModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        class={selectedClass}
        queryClassList={queryClassList}
      />

      <LockClassModal
        open={openBanModal}
        onClose={handleCloseBanModal}
        class={selectedClass}
        queryClassList={queryClassList}
      />

      <DeleteClassModal
        open={openDeleteClassModal}
        onClose={handleCloseDeleteClassModal}
        class={selectedClass}
        queryClassList={queryClassList}
      /> */}
    </>
  );
}

ClassTableRow.propTypes = {
  id: PropTypes.any,
  name: PropTypes.any,
  createdAt: PropTypes.any,
  avatar: PropTypes.any,
  code: PropTypes.any,
  topic: PropTypes.any,
  room: PropTypes.any,
  description: PropTypes.any,
  selected: PropTypes.any,
  handleClick: PropTypes.any,
  queryClassList: PropTypes.any,
};
