import http from 'src/utils/http';

import { userApiPath } from 'src/constants/apiPath';

const userApi = {
  getProfile: (userId) => http.get(userApiPath.getProfile + userId),

  changePassword: (body) => http.patch(userApiPath.changePassword, body),

  forgotPassword: (body) => http.post(userApiPath.forgotPassword, body),

  resetPassword: (body) => http.post(userApiPath.resetPassword, body),

  getListUsers: (query) =>
    http.get(userApiPath.listUser, {
      params: query,
    }),
};

export default userApi;
