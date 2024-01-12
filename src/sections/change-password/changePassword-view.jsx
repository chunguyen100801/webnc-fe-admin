/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable no-unused-vars */
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
// eslint-disable-next-line import/no-extraneous-dependencies
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { changePasswordSchema } from 'src/utils/rules';
import { isAxiosBadRequestError, isAxiosUnprocessableEntityError } from 'src/utils/error';

import path from 'src/constants/path';
import userApi from 'src/apis/user.api';
import { bgGradient } from 'src/theme/css';
// import { nominalTypeHack } from 'prop-types';

export default function ChangePasswordView() {
  const theme = useTheme();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    resolver: zodResolver(changePasswordSchema),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (body) => userApi.changePassword(body),
  });

  const onSubmit = handleSubmit((data) => {
    if (changePasswordMutation.isPending) return;

    changePasswordMutation.mutate(data, {
      onSuccess: (res) => {
        toast.success(res.data?.message);
        router.push(path.account);
      },
      onError: (error) => {
        reset();
        if (isAxiosBadRequestError(error) || isAxiosUnprocessableEntityError(error)) {
          const formError = error.response?.data;
          if (formError) {
            setError('oldPassword', {
              message: error.response?.data?.message,
              type: 'Server',
            });
          }
        }
      },
    });
  });
  const renderForm = (
    <form onSubmit={onSubmit}>
      <Stack spacing={3} mb={5}>
        <div>
          <TextField
            name="oldpassword"
            label="password"
            type="password"
            {...register('oldPassword')}
            className="w-full"
          />
          <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
            {errors.oldPassword?.message}
          </p>
        </div>
        <div>
          <TextField
            name="newPassword"
            label="new password"
            type="password"
            {...register('newPassword')}
            className="w-full"
          />
          <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
            {errors.newPassword?.message}
          </p>
        </div>
        <div>
          <TextField
            name="confirmPassword"
            label="confirm password"
            type="password"
            {...register('confirmPassword')}
            className="w-full"
          />
          <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
            {errors.confirmPassword?.message}
          </p>
        </div>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        disabled={changePasswordMutation.isPending}
      >
        Change
      </LoadingButton>
    </form>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <div className="mt-20 w-1/3">
        <Typography variant="h3" className="pb-10">
          Change password
        </Typography>
        {renderForm}
      </div>
    </Box>
  );
}
