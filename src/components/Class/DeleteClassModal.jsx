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
import classApi from 'src/apis/class.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const DeleteClassModal = ({ open, onClose, classes, queryClassList, setSelectedClass }) => {
  const queryClient = useQueryClient();
  const deleteClassMutation = useMutation({
    mutationFn: () => classApi.deleteClass([classes?.id]),
  });

  const onConfirmDelete = () => {
    deleteClassMutation.mutate(null, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ['list-classes'] });
        setSelectedClass(null);
        toast.success(res.data.message);
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle marginTop={1} sx={{ textAlign: 'center' }}>
        Confirm delete {classes?.name} class?
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          <b>{classes?.name}</b> class will be permanently deleted if you take this action.
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
            disabled={deleteClassMutation.isPending}
          >
            Delete
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ flex: 1, width: '45%', marginX: '5%' }}
            disabled={deleteClassMutation.isPending}
          >
            Cancel
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

DeleteClassModal.propTypes = {
  open: PropTypes.any,
  onClose: PropTypes.any,
  queryClassList: PropTypes.any,
  classes: PropTypes.any,
  setSelectedClass: PropTypes.any,
};

export default DeleteClassModal;
