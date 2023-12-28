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

  updateUserProfile: (userId, body) =>
    http.patch(userApiPath.updateUserProfile + userId, body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  lockUser: (id) => http.patch(`${userApiPath.lockUser + id}/lock`),
  unlockUser: (id) => http.patch(`${userApiPath.unlockUser + id}/unlock`),
  deleteUser: (id) => http.delete(`${userApiPath.deleteUser + id}`),
  deleteUserList: (body) => http.delete(`${userApiPath.deleteUser}list/${body.join(',')}`),
};

export default userApi;
