<template>
  <header class="header">
    <div class="container nav">
      <h1><router-link to="/">✨ Scripts</router-link></h1>
      <nav>
        <router-link to="/">🏠 Home</router-link>
        
        <template v-if="isLoggedIn">
          <router-link to="/myscripts">📂 My Scripts</router-link>
          <span class="user-display">👤 {{ username }}</span>
          <button @click="handleLogout" class="logout">🚪 Logout</button>
        </template>

        <template v-else>
          <router-link to="/login">🔐 Login</router-link>
          <router-link to="/register">📝 Register</router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      // Initialize state
      isLoggedIn: !!localStorage.getItem("token"),
      username: ""
    };
  },
  watch: {
    // Watch for route changes to re-check login status
    '$route'() {
      this.checkLoginStatus();
    }
  },
  created() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem("token");
      this.isLoggedIn = !!token;
      
      if (token) {
        try {
          // Decode the username from the JWT token if you store it there
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.username = payload.username;
        } catch (e) {
          this.username = "User";
        }
      }
    },
    handleLogout() {
      localStorage.removeItem("token");
      this.isLoggedIn = false;
      this.$router.push("/login");
      // Optional: use your new toast
      // this.toast.info("Logged out successfully");
    }
  }
};
</script>