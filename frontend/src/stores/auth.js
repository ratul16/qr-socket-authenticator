import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: false,
  }),
  actions: {
    setUserDetails(userDetails) {
      this.user = userDetails;
    },
    setLoginStatus(status) {
      this.isLoggedIn = status;
    },
    getUser() {
      return this.user ? { ...this.user } : null;
    }
  },
});