<template>
  <header class="header">
    <div class="container nav">
      <h1>
        <router-link to="/">✨ Scripts</router-link>
      </h1>
      <nav>
        <router-link to="/">🏠<span class="nav-text">Home</span></router-link>
        
        <template v-if="isLoggedIn">
          <span class="user-display">
            👤<span class="nav-text">{{ username }}</span>
          </span>
          <router-link to="/my-scripts">📂<span class="nav-text">My Scripts</span></router-link>
        </template>

        <router-link v-if="!isLoggedIn" to="/login">🔐<span class="nav-text">Login</span></router-link>
        <router-link v-if="!isLoggedIn" to="/register">✨<span class="nav-text">Register</span></router-link>
        
        <button v-if="isLoggedIn" class="logout" @click="logout">
          🚪<span class="logout-text">Logout</span>
        </button>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      username: ""
    };
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem("token");
    },
  },
  watch: {
    '$route': 'loadUser'
  },
  mounted() {
    this.loadUser();
  },
  methods: {
    loadUser() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.username = payload.username || "Writer";
        } catch (e) {
          this.username = "Writer";
        }
      }
    },
    logout() {
      localStorage.removeItem("token");
      this.username = "";
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.user-display {
  color: var(--neon-violet);
  font-weight: 600;
  padding: 0 10px;
  border-left: 1px solid rgba(255,255,255,0.1);
}
/* Existing styles... */
</style>