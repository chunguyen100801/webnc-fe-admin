/* eslint-disable no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
import http from 'src/utils/http';

import { memberApiPath } from 'src/constants/apiPath';

const userApi = {
  getMemberList: (classId) => http.get(`courses/${classId}/users`),

  mapStudentId: ({ userId }, body) => http.patch(`users/${userId}/student-id`, body),

  unmapStudentId: ({ userId }, body) => http.delete(`users/${userId}/student-id`, body),
};

export default userApi;
