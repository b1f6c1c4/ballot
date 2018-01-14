import root from 'window-or-global';
import 'whatwg-fetch';

export const apiUrl = (raw) => raw || '/api';

export const makeApi = (url) => apiUrl(process.env.API_URL, root.location.hostname) + url;

function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

async function apiBare(method, url, auth) {
  const response = await fetch(makeApi(url), {
    method,
    headers: {
      Authorization: auth,
    },
  });

  checkStatus(response);
  return parseJSON(response);
}

export async function api(method, url, auth, body) {
  if (!body) {
    return apiBare(method, url, auth);
  }

  const response = await fetch(makeApi(url), {
    method,
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  checkStatus(response);
  return parseJSON(response);
}

export const GET = /* istanbul ignore next */ (url, auth, body) => api('GET', url, auth, body);
export const POST = /* istanbul ignore next */ (url, auth, body) => api('POST', url, auth, body);
export const PUT = /* istanbul ignore next */ (url, auth, body) => api('PUT', url, auth, body);
export const DELETE = /* istanbul ignore next */ (url, auth) => api('DELETE', url, auth);
export const PATCH = /* istanbul ignore next */ (url, auth, body) => api('PATCH', url, auth, body);
