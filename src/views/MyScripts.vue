<template>
  <div class="container">
    <div class="header-row">
      <h2 class="page-title">📂 My Published Scripts</h2>
      <button v-if="myScripts.length > 0" class="btn-add-top" @click="$router.push('/scripts/new')">
        + New Script
      </button>
    </div>
    
    <div v-if="myScripts.length > 0" class="scripts-grid">
      <div v-for="script in myScripts" :key="script._id" class="script-card">
        <h3>{{ script.title }}</h3>
        <p>{{ script.content.substring(0, 100) }}...</p>
        
        <div class="card-actions">
          <button @click="$router.push(`/scripts/${script._id}`)" class="btn-view">View</button>
          <button @click="$router.push(`/scripts/${script._id}/edit`)" class="btn-edit">Edit</button>
          <button @click="deleteScript(script._id)" class="btn-delete">Delete</button>
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
    this.fetchScripts();
  },
  methods: {
    async fetchScripts() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        this.currentUsername = payload.username;

        const res = await api.get("/scripts");
        this.myScripts = res.data.filter(
          script =>
            script.author &&
            script.author.username === this.currentUsername
        );
      } catch (err) {
        console.error("Failed to load scripts", err);
      }
    },
    async deleteScript(id) {
      if (confirm("Are you sure you want to delete this script?")) {
        try {
          await api.delete(`/scripts/${id}`);
          this.myScripts = this.myScripts.filter(s => s._id !== id);
        } catch (err) {
          console.error("Delete failed", err);
        }
      }
    }
  }
};
</script>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.scripts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
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
  flex-wrap: wrap;
}

/* Button Styles */
.btn-view { background: #4a4e69; color: white; padding: 8px 18px; border-radius: 8px; cursor: pointer; border:none; }
.btn-edit { background: var(--neon-violet); color: white; padding: 8px 18px; border-radius: 8px; cursor: pointer; border:none; }
.btn-delete { background: #ef4444; color: white; padding: 8px 18px; border-radius: 8px; cursor: pointer; border:none; }
.btn-add-top { 
  background: var(--neon-violet); 
  color: white; 
  padding: 10px 20px; 
  border-radius: 10px; 
  border: none; 
  cursor: pointer;
  font-weight: bold;
}

.btn-view:hover, .btn-edit:hover, .btn-delete:hover, .btn-add-top:hover { opacity: 0.8; }

/* Empty State */
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
  color: #cbd5e1;
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
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
  box-shadow: 0 4px 20px rgba(157, 78, 221, 0.4);
}
</style>