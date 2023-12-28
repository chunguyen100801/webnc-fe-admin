/* eslint-disable no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
import http from 'src/utils/http';

import { memberApiPath } from 'src/constants/apiPath';

const userApi = {
  getMemberList: (classId) => http.get(`courses/${classId}/users`),

  mapStudentId: ({ classId, userId }, body) =>
    http.patch(`courses/${classId}/enrollments/${userId}/student-id`, body),

  unmapStudentId: ({ classId, userId }, body) =>
    http.delete(`courses/${classId}/enrollments/${userId}/student-id`, body),
};

export default userApi;
