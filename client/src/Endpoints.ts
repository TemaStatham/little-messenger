export const apiURl = 'localhost:8080';

export const Endpoints = {
  login: `http://${apiURl}/auth/sign-in`,
  register: `http://${apiURl}/auth/sign-up`,
  session: `http://${apiURl}/session`,
  logout: `http://${apiURl}/logout`,
  api: `http://${apiURl}/api`,
  ws: `ws://${apiURl}/ws`,
};
