import api from "./axios";

/**
 * Login — returns { access, refresh }
 * @param {{ username: string, password: string }} credentials
 */
export const login = (credentials) =>
  api.post("auth/login/", credentials).then((res) => res.data);

/**
 * Register — returns { user, access, refresh }
 * @param {{ username: string, email: string, password: string }} data
 */
export const register = (data) =>
  api.post("auth/register/", data).then((res) => res.data);

/**
 * Refresh access token.
 * @param {string} refreshToken
 */
export const refreshToken = (refreshToken) =>
  api.post("auth/token/refresh/", { refresh: refreshToken }).then((res) => res.data);
