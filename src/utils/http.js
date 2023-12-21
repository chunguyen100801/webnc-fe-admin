/* eslint-disable no-else-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */
/* eslint-disable func-names */
import { toast } from 'react-toastify';
import axios, { HttpStatusCode } from 'axios';

import { authApiPath } from 'src/constants/apiPath';

import { isAxiosUnauthorized, isAxiosExpiredTokenError } from './error';
import {
  clearLS,
  setProfileToLS,
  getProfileFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
} from './auth';

function createHttpInstance() {
  let accessToken = getAccessTokenFromLS();
  let refreshToken = getRefreshTokenFromLS();
  let profile = getProfileFromLS();
  let refreshTokenRequest = null;

  const http = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add a request interceptor
  http.interceptors.request.use(
    (config) => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const urlQueryParams = Object.fromEntries([...urlSearchParams]);

      if (config.headers) {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        } else if (urlQueryParams.access_token) {
          accessToken = urlQueryParams.access_token;
          refreshToken = urlQueryParams.refresh_token;
          config.headers.Authorization = 'Bearer ' + accessToken;
          setAccessTokenToLS(accessToken);
          setRefreshTokenToLS(refreshToken);
        }
      }

      return config;
    },
    (error) =>
      // Do something with request error
      Promise.reject(error)
  );

  // Add a response interceptor
  http.interceptors.response.use(
    (response) => {
      const url = response.config.url;

      if (url === authApiPath.signin) {
        const data = response.data;
        accessToken = data.data?.accessToken;
        refreshToken = data.data?.refreshToken;
        setAccessTokenToLS(accessToken);
        setRefreshTokenToLS(refreshToken);
      } else if (url === authApiPath.getMe) {
        profile = response.data;
        setProfileToLS(profile);
      } else if (url === authApiPath.signout) {
        accessToken = '';
        refreshToken = '';
        profile = null;
        clearLS();
      }
      return response;
    },
    async (error) => {
      const statusCheck = error.response?.status;

      // Chỉ toast lỗi không phải 422 và 401
      if (
        statusCheck &&
        ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(statusCheck)
      ) {
        const data = error.response?.data;
        const message = data?.message || error.message;
        toast.error(message);
      }

      if (isAxiosUnauthorized(error)) {
        const config = error.response?.config || { headers: {} };
        const { url } = config;

        if (isAxiosExpiredTokenError(error) && url !== authApiPath.refreshToken) {
          // eslint-disable-next-line no-unneeded-ternary
          refreshTokenRequest = refreshTokenRequest
            ? refreshTokenRequest
            : HandleRefreshToken().finally(() => {
                setTimeout(() => {
                  refreshTokenRequest = null;
                }, 3000);
              });

          await refreshTokenRequest;
          // eslint-disable-next-line no-return-await
          return await http(config);
        } else {
          clearLS();
        }
        if (url === authApiPath.refreshToken) {
          HandleClearRedux();
        }

        clearLS();
        accessToken = '';
        refreshToken = '';
        profile = null;

        toast.error(error.response?.data.data?.message || error.response?.data.message);
      }
      return Promise.reject(error);
    }
  );

  const HandleRefreshToken = async () => {
    try {
      //   const res = await authApi.refreshToken(refreshToken);
      const res = await http.post(authApiPath.refreshToken, { refreshToken });
      accessToken = res.data.data.accessToken;
      setAccessTokenToLS(accessToken);
    } catch (err) {
      clearLS();
      accessToken = '';
      refreshToken = '';
      HandleClearRedux();
      throw err;
    }
  };

  return http;
}

const HandleClearRedux = () => {
  console.log('clear redux');
  window.location.reload();
};

const http = createHttpInstance();
export default http;
