/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { toast } from 'react-toastify';
// eslint-disable-next-line perfectionist/sort-imports
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { loginSchema } from 'src/utils/rules';

import path from 'src/constants/path';
import userApi from 'src/apis/user.api';
import { bgGradient } from 'src/theme/css';

const forgotPasswordSchema = loginSchema.pick({ email: true });

export default function ForgotPasswordView() {
  const theme = useTheme();
  const { isSendEmail, setIsSendEmail } = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (body) => userApi.forgotPassword(body),
  });

  const onSubmit = handleSubmit((data) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Your password has been reset. Please check your email.');
        setIsSendEmail(true);
        // router.push(path.signin);
      },
      onError: (error) => {
        setError('email', {
          type: 'Server',
          message: error?.response?.data?.message,
        });
      },
    });
  });

  const handleResendVerifyPassword = () => {
    // forgotPasswordMutation.reset()
  };

  const renderForm = (
    <form onSubmit={onSubmit}>
      <Stack>
        <TextField name="email" label="Email address" {...register('email')} />
        <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
          {errors.email?.message}
        </p>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{ my: 3, cursor: 'pointer' }}
      >
        <RouterLink to={path.signin}>
          <Typography
            sx={{
              color: 'blue',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
            variant="subtitle2"
          >
            Sign in
          </Typography>
        </RouterLink>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" color="inherit">
        Send Email
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
            Forgot password
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
