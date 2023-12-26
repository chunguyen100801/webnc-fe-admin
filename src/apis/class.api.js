import http from 'src/utils/http';

import { classApiPath } from 'src/constants/apiPath';

const classApi = {
  getListClasses: (query) =>
    http.get(classApiPath.getListClasses, {
      params: query,
    }),
  //   getProfile: (userId) => http.get(userApiPath.getProfile + userId),
  //   changePassword: (body) => http.patch(userApiPath.changePassword, body),
  //   forgotPassword: (body) => http.post(userApiPath.forgotPassword, body),
  //   resetPassword: (body) => http.post(userApiPath.resetPassword, body),
  //   getListUsers: (query) =>
  //     http.get(userApiPath.listUser, {
  //       params: query,
  //     }),
  //   updateUserProfile: (userId, body) =>
  //     http.patch(userApiPath.updateUserProfile + userId, body, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     }),
  //   lockUser: (id) => http.patch(`${userApiPath.lockUser + id}/lock`),
  //   unlockUser: (id) => http.patch(`${userApiPath.unlockUser + id}/unlock`),
  //   deleteUser: (id) => http.delete(`${userApiPath.deleteUser + id}`),
};

export default classApi;
