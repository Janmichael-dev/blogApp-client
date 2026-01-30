<template>
  <div class="container auth">
    <h2>✨ Create Account</h2>
    <!-- Registration Form -->
    <form @submit.prevent="register">
      <input
        type="text"
        placeholder="Username"
        v-model="username"
        required
      />
      <input
        type="email"
        placeholder="Email"
        v-model="email"
        required
      />
      <input
        type="password"
        placeholder="Password (min 6 characters)"
        v-model="password"
        minlength="6"
        required
      />
      <button class="btn">Register</button>
    </form>
    
    <p style="text-align: center; margin-top: 1.5rem; color: var(--text-gray);">
      Already have an account? 
      <router-link to="/login" style="color: var(--neon-violet); text-decoration: none;">
        Login here
      </router-link>
    </p>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
    };
  },
  methods: {
    async register() {
      if (!this.username.trim()) {
        alert("Please enter a username");
        return;
      }
      if (this.password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      try {
        await api.post("/writers/register", {
          username: this.username,
          email: this.email,
          password: this.password,
        });
        alert("Registration successful! Please log in.");
        this.$router.push("/login");
      } catch (error) {
        console.error("Registration error:", error);
        if (error.response?.data?.error) {
          alert(error.response.data.error);
        } else {
          alert("Registration failed. Username or email may already exist.");
        }
      }
    },
  },
};
</script>