import jwtDecode from 'jwt-decode';
import * as GLOBAL_CONTAINER from './constants';

// Actions
export function openDrawer() {
  return {
    type: GLOBAL_CONTAINER.OPEN_DRAWER_ACTION,
  };
}

export function closeDrawer() {
  return {
    type: GLOBAL_CONTAINER.CLOSE_DRAWER_ACTION,
  };
}

export function openAccount() {
  return {
    type: GLOBAL_CONTAINER.OPEN_ACCOUNT_ACTION,
  };
}

export function closeAccount() {
  return {
    type: GLOBAL_CONTAINER.CLOSE_ACCOUNT_ACTION,
  };
}

export function login(token) {
  const decoded = jwtDecode(token);
  decoded.token = token;

  return {
    type: GLOBAL_CONTAINER.LOGIN_ACTION,
    credential: decoded,
  };
}

export function logout() {
  return {
    type: GLOBAL_CONTAINER.LOGOUT_ACTION,
  };
}
