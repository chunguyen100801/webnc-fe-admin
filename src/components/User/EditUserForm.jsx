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
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  IconButton,
  Box,
  CircularProgress,
  Avatar,
} from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosUnprocessableEntityError } from 'src/utils/error';
import { omit } from 'lodash';
import { registerSchema, updateProfileSchema } from 'src/utils/rules';
import authApi from 'src/apis/auth.api';
import { Role, Sex } from 'src/constants/const';
import { toast } from 'react-toastify';
import { USER_MESSAGES } from 'src/constants/message';
import { Icon } from '@iconify/react';
import Iconify from '../iconify';
import userApi from 'src/apis/user.api';

const EditUserForm = ({ open, onClose, queryUserList, user }) => {
  const navigate = useNavigate();
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
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    if (user) {
      setValue('firstName', user.firstName);
      setValue('lastName', user.lastName);
      setValue('phoneNumber', user.phoneNumber);
      setValue('address', user.address);
    }
  }, [user, setValue]);

  // eslint-disable-next-line arrow-body-style

  const previewAvatar = useMemo(
    () => (fileAvatar ? URL.createObjectURL(fileAvatar) : user?.avatar),
    [fileAvatar, user?.avatar]
  );

  const updateProfileMutation = useMutation({
    mutationFn: (body) => userApi.updateUserProfile(user.id, body),
  });

  const onSubmit = handleSubmit((data) => {
    data.avatar = fileAvatar;
    if (updateProfileMutation.isPending) return;

    updateProfileMutation.mutate(data, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: ['list-users', queryUserList],
        });
        reset();
        toast.success(res.data.message);
        onClose();
      },
      onError: (error) => {
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
      },
    });
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
          display: updateProfileMutation.isPending ? 'flex' : 'none', // Hiển thị khi isLoading là true
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
        {user?.email}
        <IconButton onClick={onClose} color="inherit" size="small">
          <Icon icon="material-symbols:close" width="25" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ marginTop: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <div>
              <TextField
                disabled={updateProfileMutation.isPending}
                label="First Name"
                name="firstName"
                fullWidth
                {...register('firstName')}
              />
              <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
                {errors.firstName?.message}
              </p>
            </div>
            <div>
              {' '}
              <TextField
                disabled={updateProfileMutation.isPending}
                label="Last Name"
                name="lastName"
                fullWidth
                {...register('lastName')}
              />
              <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
                {errors.lastName?.message}
              </p>
            </div>
          </Stack>
          <FormControl fullWidth>
            <InputLabel id="sex-label">Sex</InputLabel>
            <Select
              disabled={updateProfileMutation.isPending}
              labelId="sex-label"
              label="Sex"
              {...register('sex')}
              defaultValue={user?.sex}
            >
              <MenuItem value={Sex.NONE}>None</MenuItem>
              <MenuItem value={Sex.MALE}>Male</MenuItem>
              <MenuItem value={Sex.FEMALE}>Female</MenuItem>
            </Select>
          </FormControl>
          <div>
            {' '}
            <TextField
              disabled={updateProfileMutation.isPending}
              label="Phone Number"
              name="phoneNumber"
              fullWidth
              {...register('phoneNumber')}
            />
            <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
              {errors.phoneNumber?.message}
            </p>
          </div>
          <div>
            <TextField
              disabled={updateProfileMutation.isPending}
              name="address"
              label="Address"
              fullWidth
              {...register('address')}
            />
            <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
              {errors.address?.message}
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
              {user?.firstName?.charAt(0).toUpperCase()}
            </Avatar>
            <input
              {...register('avatar')}
              type="file"
              className="hidden"
              accept=".jpg, .jpeg, .png"
              ref={fileInputRef}
              onChange={onFileChange}
            />
            <Stack
              sx={{
                textAlign: 'left',
                marginRight: {
                  sm: 12,
                },
              }}
            >
              <Button type="button" variant="outlined" color="primary" onClick={handleChooseAvatar}>
                Choose Avatar
              </Button>
              <span className="mt-3 text-xs text-gray-400">Maximum image size: 5MB</span>
              <span className="text-xs text-gray-400">File: .jpg, .jpeg, .png</span>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ marginBottom: 2 }}>
        <Button onClick={onClose} disabled={updateProfileMutation.isPending}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={updateProfileMutation.isPending} color="primary">
          Update User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditUserForm.propTypes = {
  open: PropTypes.any,
  onClose: PropTypes.any,
  queryUserList: PropTypes.any,
  user: PropTypes.any,
  setUser: PropTypes.any,
};

export default EditUserForm;
