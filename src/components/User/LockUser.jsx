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

const LockUserModal = ({ open, onClose, user, queryUserList }) => {
  const queryClient = useQueryClient();
  const lockUserMutation = useMutation({
    mutationKey: ['ban-user'],
    mutationFn: () => userApi.lockUser(user?.id),
  });

  const unlockUserMutation = useMutation({
    mutationKey: ['unlock-user'],
    mutationFn: () => userApi.unlockUser(user?.id),
  });
  const onConfirmUnlock = () => {
    unlockUserMutation.mutate(null, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ['list-users', queryUserList] });
        toast.success(res.data.message);
        onClose();
      },
    });
  };

  const onConfirmLock = () => {
    lockUserMutation.mutate(null, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ['list-users', queryUserList] });
        toast.success(res.data.message);
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle marginTop={1} sx={{ textAlign: 'center' }}>
        {user?.deleted ? <> Confirm unlock {user?.email}?</> : <> Confirm lock {user?.email}?</>}
      </DialogTitle>
      <DialogContent>
        {user?.deleted ? (
          <>{}</>
        ) : (
          <Typography variant="body1" gutterBottom>
            <b>{user?.fullName}</b> will not be able to log in to the web if you confirm this
            action.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 2,
          }}
        >
          {user?.deleted ? (
            <Button
              onClick={onConfirmUnlock}
              color="primary"
              variant="contained"
              sx={{ flex: 1, width: '45%', marginX: '5%' }}
              disabled={unlockUserMutation.isPending}
            >
              Unlock
            </Button>
          ) : (
            <Button
              onClick={onConfirmLock}
              color="error"
              variant="contained"
              sx={{ flex: 1, width: '45%', marginX: '5%' }}
              disabled={lockUserMutation.isPending}
            >
              Lock
            </Button>
          )}
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ flex: 1, width: '45%', marginX: '5%' }}
            disabled={unlockUserMutation.isPending || lockUserMutation.isPending}
          >
            Cancel
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

LockUserModal.propTypes = {
  open: PropTypes.any,
  onClose: PropTypes.any,
  queryUserList: PropTypes.any,
  user: PropTypes.any,
};

export default LockUserModal;
