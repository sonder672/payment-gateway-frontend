export default {
  logout() {
    this.removeAuthToken();
  },

  getAuthToken() {
    return localStorage.getItem('authToken');
  },

  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  },

  removeAuthToken() {
    localStorage.removeItem('authToken');
  },

  isAuthenticated() {
    const token = this.getAuthToken();
    return token && !this.isTokenExpired(token);
  },

  isTokenExpired(token) {
  },
};