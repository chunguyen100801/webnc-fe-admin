/* eslint-disable perfectionist/sort-named-imports */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// eslint-disable-next-line perfectionist/sort-imports
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { loginSchema } from 'src/utils/rules';

import path from 'src/constants/path';
import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import authApi from 'src/apis/auth.api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { isAxiosBadRequestError, isAxiosNotFound, isAxiosUnauthorized } from 'src/utils/error';
import { AppContext } from 'src/context/app.context';
import useQueryString from 'src/routes/hooks/use-queryString';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const navigate = useNavigate();

  const { setIsAuthenticated, setProfile } = useContext(AppContext);

  const [showPassword, setShowPassword] = useState(false);

  const queryString = useQueryString();
  const queryConfig = {
    access_token: queryString.access_token || '',
    refresh_token: queryString.refresh_token || '',
  };

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
    resolver: zodResolver(loginSchema),
  });

  const signinMutation = useMutation({
    mutationFn: (body) => authApi.signin(body),
  });

  const getMeQuery = useQuery({
    queryKey: ['me'],
    queryFn: authApi.getMe,
    enabled: signinMutation.isSuccess,
    gcTime: 0,
  });
  useEffect(() => {
    if (getMeQuery.isSuccess) {
      const profile = getMeQuery.data.data;
      setProfile(profile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMeQuery.isSuccess]);

  useEffect(() => {
    if (queryConfig.access_token && queryConfig.refresh_token) {
      getMeQuery.refetch();
    }
  }, [getMeQuery, queryConfig.access_token, queryConfig.refresh_token]);

  const onSubmit = handleSubmit((data) => {
    if (signinMutation.isPending || getMeQuery.isFetching) return;

    signinMutation.mutate(data, {
      onSuccess: (res) => {
        setIsAuthenticated(true);
        navigate(path.user);
        getMeQuery.refetch();
      },
      onError: (error) => {
        if (isAxiosBadRequestError(error) || isAxiosUnauthorized(error) || isAxiosNotFound(error)) {
          setError('email', {
            message: error.response?.data?.message,
            type: 'Server',
          });
        }
      },
    });
  });

  const renderForm = (
    <form onSubmit={onSubmit}>
      <Stack spacing={3}>
        <div className="w-full">
          <TextField name="email" label="Email address" {...register('email')} className="w-full" />
          <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
            {errors.email?.message}
          </p>
        </div>
        <div className="w-full">
          <TextField
            className="w-full"
            {...register('password')}
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <p className="ml-1 flex min-h-[20px] items-center gap-1 text-xs font-normal text-red-400">
            {errors.password?.message}
          </p>
        </div>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{ my: 3, cursor: 'pointer' }}
      >
        <RouterLink to={path.forgotPassword}>
          <Typography
            sx={{
              color: 'blue',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
            variant="subtitle2"
          >
            Forgot password?
          </Typography>
        </RouterLink>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        disabled={signinMutation.isPending}
      >
        Login
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
            Sign in to Classroom
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
