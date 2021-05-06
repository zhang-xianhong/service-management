import Cookies from 'js-cookie';

const TOKENKEY = 'TOKEN';

export function getToken() {
  return Cookies.get(TOKENKEY);
}

export function setToken(token: string) {
  return Cookies.set(TOKENKEY, token);
}

export function removeToken() {
  return Cookies.remove(TOKENKEY);
}

export function getCookies() {
  return Cookies.getJSON();
}
