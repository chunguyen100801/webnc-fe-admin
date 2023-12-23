/* eslint-disable unused-imports/no-unused-imports */
import { omit } from 'lodash';
/* eslint-disable no-unused-vars */
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
// eslint-disable-next-line import/no-extraneous-dependencies
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import { Card } from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';
import useQueryString from 'src/routes/hooks/use-queryString';

import { resetPasswordSchema } from 'src/utils/rules';
import { isAxiosBadRequestError, isAxiosUnprocessableEntityError } from 'src/utils/error';

import path from 'src/constants/path';
import userApi from 'src/apis/user.api';
import { bgGradient } from 'src/theme/css';
// import { nominalTypeHack } from 'prop-types';

export default function ResetPasswordView() {
  const theme = useTheme();

  const router = useRouter();

  const queryString = useQueryString();
  const token = queryString?.token;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (body) => userApi.resetPassword(body),
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!token || resetPasswordMutation.isPending) return;

    const body = omit(
      {
        ...data,
        token,
      },
      ['confirmPassword']
    );

    resetPasswordMutation.mutate(body, {
      onSuccess: (res) => {
        toast.success(res.data.message);
        router.push(path.signin);
      },
    });
  });

  const renderForm = (
    <form onSubmit={onSubmit}>
      <Stack spacing={3} mb={5}>
        <div>
          <TextField
            name="password"
            label="new password"
            type="password"
            {...register('password')}
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
        disabled={resetPasswordMutation.isPending}
      >
        Reset
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
        height: 1,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h3" className="pb-10 text-center">
            ADMIN
          </Typography>
          <Typography variant="h4" className="pb-5">
            Reset password
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
