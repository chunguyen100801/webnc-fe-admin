/* eslint-disable import/order */
/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable no-unused-vars */
/* eslint-disable perfectionist/sort-named-imports */
/* eslint-disable perfectionist/sort-imports */
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  IconButton,
  Box,
  CircularProgress,
  Avatar,
} from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosUnprocessableEntityError } from 'src/utils/error';
import { memberSchema } from 'src/utils/rules';
import { toast } from 'react-toastify';
import { Icon } from '@iconify/react';
import memberApi from 'src/apis/member.api';
import { useParams } from 'react-router-dom';

const EditMemberModal = ({ open, onClose, member, setSelectedMember }) => {
  const queryClient = useQueryClient();
  const params = useParams();

  const classId = params?.classId;
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(memberSchema),
  });

  useEffect(() => {
    if (member) {
      setValue('studentId', member.studentId);
    }
  }, [member, setValue]);

  // eslint-disable-next-line arrow-body-style

  const mapStudenIdMutation = useMutation({
    mutationFn: (body) => memberApi.mapStudentId({ userId: member.id, classId }, body),
  });

  const unmapStudenIdMutation = useMutation({
    mutationFn: (body) => memberApi.unmapStudentId({ userId: member.id, classId }, body),
  });

  const onClickMap = handleSubmit((data) => {
    if (mapStudenIdMutation.isPending || unmapStudenIdMutation.isPending) return;
    mapStudenIdMutation.mutate(data, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: ['list-member'],
        });
        reset();
        toast.success(res.data.message);
        onClose();
        setSelectedMember(null);
      },
    });
  });

  const onClickUnmap = handleSubmit((data) => {
    if (mapStudenIdMutation.isPending || unmapStudenIdMutation.isPending) return;
    unmapStudenIdMutation.mutate(data, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: ['list-member'],
        });
        reset();
        toast.success(res.data.message);
        onClose();
        setSelectedMember(null);
      },
    });
  });

  return (
    <Dialog open={open}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display:
            mapStudenIdMutation.isPending || unmapStudenIdMutation.isPending ? 'flex' : 'none', // Hiển thị khi isLoading là true
        }}
      >
        <CircularProgress />
      </Box>
      <DialogTitle
        variant="h5"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginY: 2,
        }}
      >
        {member?.email}
        <IconButton onClick={onClose} color="inherit" size="small">
          <Icon icon="material-symbols:close" width="25" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ marginTop: 1 }}>
          <div>
            {' '}
            <TextField
              disabled={mapStudenIdMutation.isPending || unmapStudenIdMutation.isPending}
              label="Student ID"
              name="studentId"
              fullWidth
              {...register('studentId')}
            />
            <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
              {errors.studentId?.message}
            </p>
          </div>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ marginBottom: 2 }}>
        <Button
          onClick={onClickUnmap}
          disabled={mapStudenIdMutation.isPending || unmapStudenIdMutation.isPending}
        >
          Unmap Id
        </Button>
        <Button
          onClick={onClickMap}
          disabled={mapStudenIdMutation.isPending || unmapStudenIdMutation.isPending}
          color="primary"
        >
          Map Id
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditMemberModal.propTypes = {
  open: PropTypes.any,
  onClose: PropTypes.any,
  member: PropTypes.any,
  setSelectedMember: PropTypes.any,
};

export default EditMemberModal;
