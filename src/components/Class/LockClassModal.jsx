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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import classApi from 'src/apis/class.api';

const LockClassModal = ({ open, onClose, classes, queryClassList }) => {
  const queryClient = useQueryClient();

  const lockClassMutation = useMutation({
    mutationFn: () => classApi.lockClass(classes?.id),
  });

  const unlockClassMutation = useMutation({
    mutationFn: () => classApi.unLockClass(classes?.id),
  });

  const onConfirmLock = () => {
    lockClassMutation.mutate(null, {
      onSuccess: async (res) => {
        await queryClient.invalidateQueries({ queryKey: ['list-classes', queryClassList] });
        toast.success(res.data.message);
        onClose();
      },
    });
  };

  const onConfirmUnlock = () => {
    unlockClassMutation.mutate(null, {
      onSuccess: async (res) => {
        await queryClient.invalidateQueries({ queryKey: ['list-classes', queryClassList] });
        toast.success(res.data.message);
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle marginTop={1} sx={{ textAlign: 'center' }}>
        {classes?.deleted ? (
          <> Confirm unlock {classes?.name}?</>
        ) : (
          <> Confirm lock {classes?.name}?</>
        )}
      </DialogTitle>
      <DialogContent>
        {classes?.deleted ? (
          <>{}</>
        ) : (
          <Typography variant="body1" gutterBottom>
            The members of <b>{classes?.name}</b> will not be able to access to the class if you
            confirm this action.
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
          {classes?.deleted ? (
            <Button
              onClick={onConfirmUnlock}
              color="primary"
              variant="contained"
              sx={{ flex: 1, width: '45%', marginX: '5%' }}
              disabled={unlockClassMutation.isPending}
            >
              Unlock
            </Button>
          ) : (
            <Button
              onClick={onConfirmLock}
              color="error"
              variant="contained"
              sx={{ flex: 1, width: '45%', marginX: '5%' }}
              disabled={lockClassMutation.isPending}
            >
              Lock
            </Button>
          )}
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ flex: 1, width: '45%', marginX: '5%' }}
            disabled={unlockClassMutation.isPending || lockClassMutation.isPending}
          >
            Cancel
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

LockClassModal.propTypes = {
  open: PropTypes.any,
  onClose: PropTypes.any,
  queryClassList: PropTypes.any,
  classes: PropTypes.any,
};

export default LockClassModal;
