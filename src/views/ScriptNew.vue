<template>
  <div class="container auth">
    <h2>✨ Create New Script</h2>
    <form @submit.prevent="createScript">
      <input
        type="text"
        placeholder="Script Title"
        v-model="title"
        required
      />
      
      <textarea
        placeholder="Script Content"
        v-model="content"
        rows="15"
        required
      ></textarea>
      
      <div style="display: flex; gap: 1rem;">
        <button type="submit" class="btn">
          ✅ Create Script
        </button>
        <button type="button" class="btn back" @click="$router.back()">
          ❌ Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import api from "../api";
import { useToast } from "vue-toastification";

export default {
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      title: "",
      content: "",
    };
  },
  methods: {
    async createScript() {
      if (!this.title.trim() || !this.content.trim()) {
        this.toast.warning("Please fill in all fields");
        return;
      }

      try {
        const response = await api.post("/scripts", {
          title: this.title,
          content: this.content,
        });
        
        this.toast.success("Script created successfully! 🚀");
        // Redirect to the new script detail page
        this.$router.push(`/scripts/${response.data._id}`);
      } catch (error) {
        console.error("Failed to create script:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.toast.error("Please log in to create a script");
          this.$router.push("/login");
        } else {
          this.toast.error("Failed to create script. Please try again.");
        }
      }
    },
  },
};
</script>

<style scoped>
textarea {
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(157, 78, 221, 0.3);
  border-radius: 12px;
  color: var(--text-white);
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
  resize: vertical;
}

textarea::placeholder {
  color: var(--text-gray);
}

textarea:focus {
  outline: none;
  border-color: var(--neon-violet);
  box-shadow: 0 0 20px rgba(157, 78, 221, 0.4);
  background: rgba(255, 255, 255, 0.08);
}
</style>