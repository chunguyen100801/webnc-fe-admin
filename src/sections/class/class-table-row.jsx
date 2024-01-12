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

import Iconify from 'src/components/iconify';
// import { EditClassModal } from 'src/components/Class';
import { fDate } from 'src/utils/format-time';
import { EditClassModal } from 'src/components/Class';
import DeleteClassModal from 'src/components/Class/DeleteClassModal';
import { RouterLink } from 'src/routes/components';
import path from 'src/constants/path';
import Label from 'src/components/label';
import { Status } from 'src/constants/const';
import LockClassModal from 'src/components/Class/LockClassModal';
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
  courseTeachers,
  enrollments,
  createdBy,
  deleted,
}) {
  const [open, setOpen] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteClassModal, setOpenDeleteClassModal] = useState(false);
  const [openLockClassModal, setOpenLockClassModal] = useState(false);

  const [selectedClass, setSelectedClass] = useState(null);

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

  const handleCloseDeleteClassModal = () => {
    setOpen(null);
    setOpenDeleteClassModal(false);
  };

  const handleCloseLockClassModal = () => {
    setOpen(null);
    setOpenLockClassModal(false);
  };

  const handleEditButtonClick = () => {
    setOpen(null);
    setSelectedClass({
      id,
      name,
      createdAt,
      avatar,
      code,
      topic,
      room,
      description,
      courseTeachers,
      enrollments,
      createdBy,
    });
    setOpenEditModal(true);
  };

  const handleBanButtonClick = () => {
    setOpen(null);
    setSelectedClass({
      id,
      name,
      code,
      deleted,
    });
    setOpenLockClassModal(true);
  };

  // eslint-disable-next-line no-unsafe-optional-chaining
  const memberTotal = courseTeachers?.length + enrollments?.length;

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
            <Typography variant="subtitle2">{name}</Typography>
          </Stack>
        </TableCell>
        <TableCell>{code}</TableCell>
        <TableCell align="center">{room}</TableCell>
        <TableCell align="center">{memberTotal}</TableCell>
        <TableCell>{createdBy?.email}</TableCell>
        <TableCell align="center">{fDate(createdAt)}</TableCell>
        <TableCell>
          <Label color={(deleted === true && 'error') || 'success'}>
            {deleted ? Status.LOCKED : Status.ACTIVE}
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

        <RouterLink to={`${path.class}/${id}`} className="w-full">
          <MenuItem>
            <Iconify icon="tdesign:member" sx={{ mr: 2 }} onClick={() => setOpen(false)} />
            Members
          </MenuItem>
        </RouterLink>

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
      </Popover>
      <EditClassModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        classes={selectedClass}
        queryClassList={queryClassList}
        setSelectedClass={setSelectedClass}
      />

      <DeleteClassModal
        open={openDeleteClassModal}
        onClose={handleCloseDeleteClassModal}
        classes={selectedClass}
        queryClassList={queryClassList}
        setSelectedClass={setSelectedClass}
      />

      <LockClassModal
        open={openLockClassModal}
        onClose={handleCloseLockClassModal}
        classes={selectedClass}
        queryClassList={queryClassList}
        setSelectedClass={setSelectedClass}
      />
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
  courseTeachers: PropTypes.any,
  enrollments: PropTypes.any,
  createdBy: PropTypes.any,
  deleted: PropTypes.any,
};
