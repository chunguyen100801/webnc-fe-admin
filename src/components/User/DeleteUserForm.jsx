/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable no-unused-vars */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import userApi from 'src/apis/user.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const DeleteUserModal = ({ open, onClose, user, queryUserList }) => {
  const queryClient = useQueryClient();
  const deleteUserMutation = useMutation({
    mutationKey: ['delete-user'],
    mutationFn: () => userApi.deleteUser(user?.id),
  });

  const onConfirmDelete = () => {
    deleteUserMutation.mutate(null, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ['list-users'] });
        toast.success(res.data.message);
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle marginTop={1} sx={{ textAlign: 'center' }}>
        Confirm delete {user?.fullName}?
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          <b>{user?.email}</b> account will be permanently deleted if you take this action.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 0.5,
            marginBottom: 2,
          }}
        >
          <Button
            onClick={onConfirmDelete}
            color="error"
            variant="contained"
            sx={{ flex: 1, width: '45%', marginX: '5%' }}
            disabled={deleteUserMutation.isPending}
          >
            Delete
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ flex: 1, width: '45%', marginX: '5%' }}
            disabled={deleteUserMutation.isPending}
          >
            Cancel
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

DeleteUserModal.propTypes = {
  open: PropTypes.any,
  onClose: PropTypes.any,
  queryUserList: PropTypes.any,
  user: PropTypes.any,
};

export default DeleteUserModal;
