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
import { classSchema } from 'src/utils/rules';
import { toast } from 'react-toastify';
import { Icon } from '@iconify/react';
import classApi from 'src/apis/class.api';

const EditClassModal = ({ open, onClose, queryClassList, classes, setSelectedClass }) => {
  const queryClient = useQueryClient();

  const fileInputRef = useRef(null);

  const [fileAvatar, setFileAvatar] = useState(null);

  const {
    register,
    reset,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(classSchema),
  });

  useEffect(() => {
    if (classes) {
      setValue('name', classes.name);
      setValue('description', classes.description);
      setValue('topic', classes.topic);
      setValue('room', classes.room);
    }
  }, [classes, setValue]);

  // eslint-disable-next-line arrow-body-style

  const previewAvatar = useMemo(
    () => (fileAvatar ? URL.createObjectURL(fileAvatar) : classes?.avatar),
    [fileAvatar, classes?.avatar]
  );

  const updateClassMutation = useMutation({
    mutationFn: (body) => classApi.updateClass(classes?.id, body),
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (body) => classApi.uploadAvatarClass(classes?.id, body),
  });

  const onSubmit = handleSubmit(async (data) => {
    if (updateClassMutation.isPending || updateAvatarMutation.isPending) return;
    try {
      const res = await updateClassMutation.mutateAsync(data);
      if (!fileAvatar) {
        await res;
        await queryClient.invalidateQueries({
          queryKey: ['list-classes', queryClassList],
        });
        toast.success(res.data.message);
        reset();
        onClose();
        return;
      }
      const bodyAvatar = {
        avatar: fileAvatar,
      };
      const avatarRes = await updateAvatarMutation.mutateAsync(bodyAvatar);

      await Promise.all([avatarRes, res]);

      await queryClient.invalidateQueries({
        queryKey: ['list-classes', queryClassList],
      });
      reset();
      toast.success(res.data.message);
      onClose();
      setSelectedClass(null);
    } catch (error) {
      if (isAxiosUnprocessableEntityError(error)) {
        const formError = error.response?.data.message;
        if (formError) {
          formError.forEach((err) => {
            setError(err.fieldName, {
              message: err.errorMessage,
              type: 'server',
            });
          });
        }
      }
    }
  });

  const onFileChange = (e) => {
    const files = e?.target?.files;
    if (files && files.length > 0) {
      const file = files[0];

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Maximum image size is 5MB');
        return;
      }
      if (!['image/jpg', 'image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('File type must be .jpg, .jpeg, .png');
        return;
      }
      setFileAvatar(file);
    }
  };

  const handleChooseAvatar = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display:
            updateClassMutation.isPending || updateAvatarMutation.isPending ? 'flex' : 'none', // Hiển thị khi isLoading là true
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
        Code: {classes?.code}
        <IconButton onClick={onClose} color="inherit" size="small">
          <Icon icon="material-symbols:close" width="25" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ marginTop: 1 }}>
          <div>
            {' '}
            <TextField
              disabled={updateClassMutation.isPending || updateAvatarMutation.isPending}
              label="Class name"
              name="name"
              fullWidth
              {...register('name')}
            />
            <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
              {errors.name?.message}
            </p>
          </div>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <div style={{ flex: 2 }}>
              <TextField
                disabled={updateClassMutation.isPending || updateAvatarMutation.isPending}
                label="Topic"
                name="topic"
                fullWidth
                {...register('topic')}
                sx={{ flex: 2 }}
              />
              <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
                {errors.topic?.message}
              </p>
            </div>
            <div style={{ flex: 1 }}>
              {' '}
              <TextField
                disabled={updateClassMutation.isPending || updateAvatarMutation.isPending}
                label="Room"
                name="room"
                fullWidth
                {...register('room')}
                sx={{ flex: 1 }}
              />
              <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
                {errors.room?.message}
              </p>
            </div>
          </Stack>
          <div>
            {' '}
            <TextField
              disabled={updateClassMutation.isPending || updateAvatarMutation.isPending}
              label="Description"
              name="description"
              fullWidth
              {...register('description')}
            />
            <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
              {errors.description?.message}
            </p>
          </div>

          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" textAlign="center">
            <Avatar
              src={previewAvatar || ''}
              alt=""
              sx={{
                width: 100,
                height: 100,
                margin: 'auto',
                marginBottom: 2,
                fontSize: 40,
                marginRight: {
                  sm: 3,
                },
                border: (theme) => `solid 2px ${theme.palette.background.default}`,
              }}
            >
              {classes?.firstName?.charAt(0).toUpperCase()}
            </Avatar>
            <input
              {...register('avatar')}
              type="file"
              className="hidden"
              accept=".jpg, .jpeg, .png"
              ref={fileInputRef}
              onChange={onFileChange}
              disabled={updateClassMutation.isPending || updateAvatarMutation.isPending}
            />
            <Stack
              sx={{
                textAlign: 'left',
                marginRight: {
                  sm: 12,
                },
              }}
            >
              <Button
                type="button"
                variant="outlined"
                color="primary"
                onClick={handleChooseAvatar}
                disabled={updateClassMutation.isPending || updateAvatarMutation.isPending}
              >
                Choose Avatar
              </Button>
              <span className="mt-3 text-xs text-gray-400">Maximum image size: 5MB</span>
              <span className="text-xs text-gray-400">File: .jpg, .jpeg, .png</span>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ marginBottom: 2 }}>
        <Button
          onClick={onClose}
          disabled={updateClassMutation.isPending || updateAvatarMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={updateClassMutation.isPending || updateAvatarMutation.isPending}
          color="primary"
        >
          Update Class
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditClassModal.propTypes = {
  open: PropTypes.any,
  onClose: PropTypes.any,
  queryClassList: PropTypes.any,
  classes: PropTypes.any,
  setSelectedClass: PropTypes.any,
};

export default EditClassModal;
