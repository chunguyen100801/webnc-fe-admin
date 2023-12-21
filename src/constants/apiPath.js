/* eslint-disable prefer-template */
const PREFIX_AUTH = 'auth/';
const PREFIX_USER = 'users/';

export const authApiPath = {
  signin: PREFIX_AUTH + 'login',
  signout: PREFIX_AUTH + 'logout',
  getMe: PREFIX_AUTH + 'me',
  refreshToken: PREFIX_AUTH + 'refresh-token',
};

export const userApiPath = {
  getProfile: PREFIX_USER + 'me',
  changePassword: PREFIX_USER + 'change-password',
  forgotPassword: PREFIX_USER + 'forgot-password',
  resetPassword: PREFIX_USER + 'reset-password',
};
