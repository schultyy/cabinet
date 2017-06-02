const Identifier = 'githubtoken';

export function saveToken(token) {
  localStorage.setItem(Identifier, token);
}

export function getToken() {
  return localStorage.getItem(Identifier);
}