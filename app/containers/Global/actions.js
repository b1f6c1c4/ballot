import jwtDecode from 'jwt-decode';
import * as GLOBAL from './constants';

// Actions
export function toggleDrawerOpen() {
  return {
    type: GLOBAL.TOGGLE_DRAWER_OPEN_ACTION,
  };
}

export function updateCredential(token) {
  const decoded = jwtDecode(token);
  decoded.token = token;

  return {
    type: GLOBAL.UPDATE_CREDENTIAL_ACTION,
    credential: decoded,
  };
}
