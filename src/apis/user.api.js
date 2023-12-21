import http from 'src/utils/http';

import { userApiPath } from 'src/constants/apiPath';

const userApi = {
  getProfile: (userId) => http.get(userApiPath.getProfile + userId),

  //   uploadAvatar: (body) => http.patch(userApiPath., body, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     }),

  changePassword: (body) => http.patch(userApiPath.changePassword, body),

  forgotPassword: (body) => http.post(userApiPath.forgotPassword, body),

  resetPassword: (body) => http.post(userApiPath.resetPassword, body),
};

export default userApi;
