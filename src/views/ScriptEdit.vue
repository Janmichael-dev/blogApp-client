<template>
  <div class="container auth">
    <h2>✏️ Edit Script</h2>
    
    <form v-if="script" @submit.prevent="updateScript">
      <input
        type="text"
        placeholder="Script Title"
        v-model="script.title"
        required
      />
      
      <textarea
        placeholder="Script Content"
        v-model="script.content"
        rows="15"
        required
      ></textarea>
      
      <div class="author-info" v-if="script.author">
        <span>📝 Author: {{ script.author.username }}</span>
        <span>📅 Created: {{ formatDate(script.createdAt) }}</span>
      </div>
      
      <div style="display: flex; gap: 1rem; margin-top: 1rem;">
        <button type="submit" class="btn">
          💾 Save Changes
        </button>
        <button type="button" class="btn back" @click="$router.back()">
          ❌ Cancel
        </button>
      </div>
    </form>
    
    <p v-else class="loading">Loading script...</p>
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
      script: null,
    };
  },
  async mounted() {
    await this.fetchScript();
  },
  methods: {
    async fetchScript() {
      try {
        const id = this.$route.params.id;
        const res = await api.get(`/scripts/${id}`);
        this.script = res.data;
      } catch (error) {
        console.error("Failed to fetch script:", error);
        this.toast.error("Failed to load script ❌");
        this.$router.push("/");
      }
    },
    async updateScript() {
      if (!this.script.title.trim() || !this.script.content.trim()) {
        this.toast.warning("Please fill in all fields");
        return;
      }

      try {
        const id = this.$route.params.id;
        await api.put(`/scripts/${id}`, {
          title: this.script.title,
          content: this.script.content,
        });
        this.toast.success("Script updated successfully! ✨");
        this.$router.push(`/scripts/${id}`);
      } catch (error) {
        console.error("Failed to update script:", error);
        if (error.response?.status === 403) {
          this.toast.error("You are not authorized to edit this script");
        } else {
          this.toast.error("Failed to update script. Please try again.");
        }
      }
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
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

.author-info {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: rgba(157, 78, 221, 0.1);
  border-radius: 8px;
  color: var(--text-gray);
  font-size: 0.9rem;
}
</style>