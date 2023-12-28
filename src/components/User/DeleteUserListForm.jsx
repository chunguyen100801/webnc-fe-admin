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

const DeleteUserListModal = ({
  open,
  onClose,
  selected,
  queryUserList,
  setPage,
  setFilterName,
  setSelected,
  setSearchKey,
}) => {
  const queryClient = useQueryClient();
  const queryUserListReset = {
    order: queryUserList.order,
    page: 1,
    take: queryUserList.rowsPerPage,
    search: ' ',
  };

  const deleteUserListMutation = useMutation({
    mutationKey: ['delete-userList'],
    mutationFn: () => userApi.deleteUserList(selected),
  });

  const onConfirmDelete = () => {
    deleteUserListMutation.mutate(null, {
      onSuccess: async (res) => {
        await queryClient.invalidateQueries({ queryKey: ['list-users', queryUserListReset] });
        setSelected([]);
        setSearchKey((prevKey) => prevKey + 1);
        setFilterName(' ');
        setPage(0);
        toast.success(res.data.message);
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle marginTop={1} sx={{ textAlign: 'center' }}>
        Confirm delete {selected?.length} account?
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          The accounts will be permanently deleted if you take this action.
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
            disabled={deleteUserListMutation.isPending}
          >
            Delete
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ flex: 1, width: '45%', marginX: '5%' }}
            disabled={deleteUserListMutation.isPending}
          >
            Cancel
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

DeleteUserListModal.propTypes = {
  open: PropTypes.any,
  onClose: PropTypes.any,
  selected: PropTypes.any,
  queryUserList: PropTypes.any,
  setPage: PropTypes.any,
  setSelected: PropTypes.any,
  setFilterName: PropTypes.any,
  setSearchKey: PropTypes.any,
};

export default DeleteUserListModal;
