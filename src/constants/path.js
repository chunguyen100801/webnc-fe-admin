/* eslint-disable prefer-template */
const adminPrefix = '/admin';

const path = {
  user: adminPrefix + '/users',
  signin: adminPrefix + '/signin',
  logout: adminPrefix + '/logout',
  profile: adminPrefix + '/profile',
  change_password: adminPrefix + '/change-password',
  forgotPassword: adminPrefix + '/forgot-password',
  resetPassword: adminPrefix + '/reset-password',
  notFound: adminPrefix + '/not-found',
  class: adminPrefix + '/class',
  classDetail: adminPrefix + '/class/:classId',
};

export default path;
