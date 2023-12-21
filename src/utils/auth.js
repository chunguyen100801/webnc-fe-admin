const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const PROFILE_KEY = 'profile';

export const LocalStorageEventTarget = new EventTarget();

export const setAccessTokenToLS = (access_token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
};

export const setRefreshTokenToLS = (refresh_token) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
};

export const getAccessTokenFromLS = () => localStorage.getItem(ACCESS_TOKEN_KEY) || '';

export const getRefreshTokenFromLS = () => localStorage.getItem(REFRESH_TOKEN_KEY) || '';

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile');
  if (result) return JSON.parse(result);
  return null;
};

export const setProfileToLS = (profile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const clearLS = () => {
  localStorage.clear();
  LocalStorageEventTarget.dispatchEvent(new Event('clearLS'));
};
