/* eslint-disable prefer-template */
const PREFIX_AUTH = 'auth/';
const PREFIX_USER = 'users/';
const PREFIX_CLASS = 'courses/';

export const authApiPath = {
  signin: PREFIX_AUTH + 'login',
  signup: PREFIX_AUTH + 'register',
  signout: PREFIX_AUTH + 'logout',
  getMe: PREFIX_AUTH + 'me',
  refreshToken: PREFIX_AUTH + 'refresh-token',
};

export const userApiPath = {
  listUser: PREFIX_USER,
  getProfile: PREFIX_USER + 'me',
  changePassword: PREFIX_USER + 'me/change-password',
  forgotPassword: PREFIX_USER + 'forgot-password',
  resetPassword: PREFIX_USER + 'reset-password',
  updateUserProfile: PREFIX_USER,
  lockUser: PREFIX_USER,
  unlockUser: PREFIX_USER,
  deleteUser: PREFIX_USER,
  listNotAdmin: PREFIX_USER + 'list/not-admin',
};

export const classApiPath = {
  getListClasses: PREFIX_CLASS,
  updateClass: PREFIX_CLASS,
  uploadAvatarClass: PREFIX_CLASS,
  deleteClass: PREFIX_CLASS,
  lockClass: PREFIX_CLASS,
  unLockClass: PREFIX_CLASS,
};

export const memberApiPath = {
  getMemberList: PREFIX_CLASS,
  updateMember: PREFIX_CLASS,
  deleteMember: PREFIX_CLASS,
};
