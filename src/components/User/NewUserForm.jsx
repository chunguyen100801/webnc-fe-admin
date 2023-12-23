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
} from '@mui/material';
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

const NewUserForm = ({ open, onClose, order, page, rowsPerPage }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
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

    signupMutation.mutate(body, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: ['list-users', { order, page: page + 1, take: rowsPerPage }],
        });
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle variant="h4" sx={{}}>
        Add New User
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ marginTop: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <div>
              <TextField label="First Name" name="firstName" fullWidth {...register('firstName')} />
              <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
                {errors.firstName?.message}
              </p>
            </div>
            <div>
              {' '}
              <TextField label="Last Name" name="lastName" fullWidth {...register('lastName')} />
              <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
                {errors.lastName?.message}
              </p>
            </div>
          </Stack>
          <div>
            <TextField label="Email" name="email" fullWidth {...register('email')} />
            <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
              {errors.email?.message}
            </p>
          </div>
          <div>
            {' '}
            <TextField
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
            <TextField name="address" label="Address" fullWidth {...register('address')} />
            <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
              {errors.address?.message}
            </p>
          </div>
          <div>
            {' '}
            <TextField
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} color="primary">
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
