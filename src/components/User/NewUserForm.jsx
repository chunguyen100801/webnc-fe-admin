/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable no-unused-vars */
/* eslint-disable perfectionist/sort-named-imports */
/* eslint-disable perfectionist/sort-imports */
import PropTypes from 'prop-types';
import React from 'react';
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
} from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosUnprocessableEntityError } from 'src/utils/error';
import { omit } from 'lodash';
import { registerSchema } from 'src/utils/rules';
import authApi from 'src/apis/auth.api';
import { Role } from 'src/constants/const';
import { toast } from 'react-toastify';
import { USER_MESSAGES } from 'src/constants/message';
import { Icon } from '@iconify/react';
import Iconify from '../iconify';

const NewUserForm = ({ open, onClose, order, page, rowsPerPage }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    reset,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const signupMutation = useMutation({
    mutationFn: (body) => authApi.signup(body),
  });

  const onSubmit = handleSubmit((data) => {
    if (signupMutation.isPending) return;

    const body = omit(data, ['confirmPassword']);
    body.role = body.role === Role.ADMIN ? Role.ADMIN : Role.STUDENT;
    signupMutation.mutate(body, {
      onSuccess: async (res) => {
        await queryClient.invalidateQueries({
          queryKey: ['list-users', { order, page: page + 1, take: rowsPerPage }],
        });
        reset();
        toast.success(USER_MESSAGES.CHECK_EMAIL);
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

  const handleAddUser = () => {
    // Add logic to handle adding a new user
    // Call onAddUser with the new user data
    // Close the modal
  };

  return (
    <Dialog open={open}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: signupMutation.isPending ? 'flex' : 'none', // Hiển thị khi isLoading là true
        }}
      >
        <CircularProgress />
      </Box>
      <DialogTitle
        variant="h4"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        Add New User
        <IconButton onClick={onClose} color="inherit" size="small">
          <Icon icon="material-symbols:close" width="25" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ marginTop: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <div>
              <TextField
                disabled={signupMutation.isPending}
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
                disabled={signupMutation.isPending}
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
          <div>
            <TextField
              disabled={signupMutation.isPending}
              label="Email"
              name="email"
              fullWidth
              {...register('email')}
            />
            <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
              {errors.email?.message}
            </p>
          </div>
          <div>
            {' '}
            <TextField
              disabled={signupMutation.isPending}
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
              disabled={signupMutation.isPending}
              name="address"
              label="Address"
              fullWidth
              {...register('address')}
            />
            <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
              {errors.address?.message}
            </p>
          </div>
          <div>
            {' '}
            <TextField
              disabled={signupMutation.isPending}
              label="Password"
              name="password"
              type="password"
              fullWidth
              {...register('password')}
            />
            <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
              {errors.password?.message}
            </p>
          </div>
          <div>
            {' '}
            <TextField
              disabled={signupMutation.isPending}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              fullWidth
              {...register('confirmPassword')}
            />
            <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
              {errors.confirmPassword?.message}
            </p>
          </div>
          <FormControl fullWidth>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              disabled={signupMutation.isPending}
              labelId="role-label"
              label="Role"
              {...register('role')}
              defaultValue={Role.USER}
            >
              <MenuItem value={Role.USER}>User</MenuItem>
              <MenuItem value={Role.ADMIN}>Admin</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ marginBottom: 2 }}>
        <Button onClick={onClose} disabled={signupMutation.isPending}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={signupMutation.isPending} color="primary">
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

NewUserForm.propTypes = {
  open: PropTypes.any,
  onClose: PropTypes.any,
  order: PropTypes.any,
  page: PropTypes.any,
  rowsPerPage: PropTypes.any,
};

export default NewUserForm;
