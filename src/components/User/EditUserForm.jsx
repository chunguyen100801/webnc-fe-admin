/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable no-unused-vars */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableRow,
  TableCell,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Role } from 'src/constants/const';

const EditUserModal = ({ open, onClose, user }) => {
  const [editedRole, setEditedRole] = useState(user?.role);

  const handleRoleChange = (event) => {
    setEditedRole(event.target.value);
  };

  const handleSave = () => {
    // Perform the logic to save the edited role, e.g., make an API call
    // and update the user object
    // ...

    // Close the modal
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <Table>
          <TableRow>
            <TableCell>Name:</TableCell>
            <TableCell>{user?.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Email:</TableCell>
            <TableCell>{user?.email}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Phone Number:</TableCell>
            <TableCell>{user?.phoneNumber}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Address:</TableCell>
            <TableCell>{user?.address}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Role:</TableCell>
            <FormControl fullWidth>
              <Select label="Role" defaultValue={Role.USER}>
                <MenuItem value={Role.USER}>User</MenuItem>
                <MenuItem value={Role.ADMIN}>Admin</MenuItem>
              </Select>
            </FormControl>
          </TableRow>
        </Table>
      </DialogContent>
      <Button onClick={handleSave}>Save</Button>
      <Button onClick={onClose}>Close</Button>
    </Dialog>
  );
};

EditUserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default EditUserModal;
