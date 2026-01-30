<template>
  <div class="container auth">
    <h2>🔐 Login</h2>
    <!-- Login Form -->
    <form @submit.prevent="login">
      <input
        type="email"
        placeholder="Email"
        v-model="email"
        required
      />
      <input
        type="password"
        placeholder="Password"
        v-model="password"
        required
      />
      <button class="btn">Login</button>
    </form>
    
    <p style="text-align: center; margin-top: 1.5rem; color: var(--text-gray);">
      Don't have an account? 
      <router-link to="/register" style="color: var(--neon-violet); text-decoration: none;">
        Register here
      </router-link>
    </p>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const res = await api.post("/writers/login", {
          email: this.email,
          password: this.password,
        });
        
        // Save JWT token
        localStorage.setItem("token", res.data.token);
        
        // Store isAdmin flag if needed
        if (res.data.isAdmin !== undefined) {
          localStorage.setItem("isAdmin", res.data.isAdmin);
        }
        
        alert("Login successful!");
        
        // Redirect to home page
        this.$router.push("/");
      } catch (error) {
        console.error("Login error:", error);
        if (error.response?.status === 404) {
          alert("User not found. Please check your email.");
        } else if (error.response?.status === 401) {
          alert("Invalid password. Please try again.");
        } else {
          alert("Login failed. Please try again.");
        }
      }
    },
  },
};
</script>