/* eslint-disable prefer-template */
import http from 'src/utils/http';

import { authApiPath } from 'src/constants/apiPath';

const authApi = {
  signin: (body) => http.post(authApiPath.signin, body),

  signup: (body) => http.post(authApiPath.signup, body),

  signout: () => http.delete(authApiPath.signout),

  getMe: () => http.get(authApiPath.getMe),

  refreshToken: (refreshToken) =>
    http.post(authApiPath.refreshToken, {
      refreshToken,
    }),
};

export default authApi;
