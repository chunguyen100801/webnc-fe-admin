import axios, { HttpStatusCode } from 'axios';

export const isAxiosError = (error) => axios.isAxiosError(error);

export const isAxiosUnprocessableEntityError = (error) =>
  isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity;

export const isAxiosBadRequestError = (error) =>
  isAxiosError(error) && error.response?.status === HttpStatusCode.BadRequest;

export const isAxiosUnauthorized = (error) =>
  isAxiosError(error) &&
  (error.response?.status === HttpStatusCode.Unauthorized ||
    error.response?.status === 498 ||
    error.response?.status === 403);

export const isAxiosNotFound = (error) =>
  isAxiosError(error) && error.response?.status === HttpStatusCode.NotFound;

export const isAxiosExpiredTokenError = (error) =>
  isAxiosUnauthorized(error) && error.response?.data.message === 'Token is expired';
