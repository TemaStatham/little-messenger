export const apiURL = 'localhost:8080';

export const Endpoints = {
  login: `http://${apiURL}/auth/sign-in`,
  register: `http://${apiURL}/auth/sign-up`,
  session: `http://${apiURL}/session`,
  logout: `http://${apiURL}/logout`,
  api: `http://${apiURL}/api`,
  ws: `ws://${apiURL}/ws`,
  upload: `http://${apiURL}/api/upload`,
  static: `http://${apiURL}`,
};
