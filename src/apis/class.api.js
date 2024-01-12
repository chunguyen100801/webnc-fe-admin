import http from 'src/utils/http';

import { classApiPath } from 'src/constants/apiPath';

const classApi = {
  getListClasses: (query) =>
    http.get(classApiPath.getListClasses, {
      params: query,
    }),

  updateClass: (classId, body) => http.patch(classApiPath.updateClass + classId, body),
  uploadAvatarClass: (classId, body) =>
    http.patch(`${classApiPath.uploadAvatarClass + classId}/avatar`, body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  deleteClass: (ids) => http.delete(`${classApiPath.deleteClass}${ids.join(',')}`),

  lockClass: (id) => http.patch(`${classApiPath.lockClass + id}/lock`),
  unLockClass: (id) => http.patch(`${classApiPath.unLockClass + id}/un-lock`),
};

export default classApi;
