<template>
  <div class="container">
    <h2 class="page-title">📂 My Published Scripts</h2>
    
    <div v-if="myScripts.length > 0" class="scripts-grid">
      <div v-for="script in myScripts" :key="script._id" class="script-card">
        <h3>{{ script.title }}</h3>
        <p>{{ script.content.substring(0, 100) }}...</p>
        
        <div class="card-actions">
          <button @click="$router.push(`/scripts/${script._id}`)" class="btn-view">View</button>
          <button @click="$router.push(`/scripts/${script._id}/edit`)" class="btn-edit">Edit</button>
        </div>
      </div>
    </div>
    
    <div v-else class="empty-state">
      <div class="empty-content">
        <p>You haven't posted any scripts yet. Start sharing your work with the community!</p>
        <button class="btn-primary-action" @click="$router.push('/scripts/new')">
          ➕ Post a Script
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      myScripts: [],
      currentUsername: ""
    };
  },
  async mounted() {
    // 1. Get current user from token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.currentUsername = payload.username;
      } catch (e) {
        console.error("Token decoding failed", e);
      }
    }

    // 2. Fetch all scripts and filter
    try {
      const res = await api.get("/scripts");
      this.myScripts = res.data.filter(s => s.author?.username === this.currentUsername);
    } catch (err) {
      console.error("Error fetching your scripts", err);
    }
  }
};
</script>

<style scoped>
.scripts-grid {
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;
}

.script-card {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(157, 78, 221, 0.2);
  transition: transform 0.2s ease;
}

.script-card:hover {
  transform: translateY(-5px);
  border-color: var(--neon-violet);
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 1rem;
}

.btn-view { background: #4a4e69; color: white; padding: 8px 18px; border-radius: 8px; cursor: pointer; border:none; transition: opacity 0.2s; }
.btn-edit { background: var(--neon-violet); color: white; padding: 8px 18px; border-radius: 8px; cursor: pointer; border:none; transition: opacity 0.2s; }

.btn-view:hover, .btn-edit:hover { opacity: 0.9; }

/* Modern Empty State Styles */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5rem 2rem;
  text-align: center;
  background: rgba(157, 78, 221, 0.05);
  border-radius: 20px;
  border: 2px dashed rgba(157, 78, 221, 0.3);
  margin-top: 2rem;
}

.empty-content p {
  color: #cbd5e1; /* Soft gray-white text */
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  max-width: 400px;
}

.btn-primary-action {
  background: linear-gradient(135deg, var(--neon-violet), #7b2cbf);
  color: white;
  padding: 1.2rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(157, 78, 221, 0.4);
}

.btn-primary-action:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 10px 30px rgba(157, 78, 221, 0.6);
  filter: brightness(1.15);
}

.btn-primary-action:active {
  transform: translateY(0);
}
</style>