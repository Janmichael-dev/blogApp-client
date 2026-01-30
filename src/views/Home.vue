<template>
  <div class="container blog-list">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem;">
      <h2>All Scripts</h2>
      <button v-if="isLoggedIn" class="btn-add" @click="addScript">
        ➕ Add Script
      </button>
    </div>
    
    <div class="cards">
      <ScriptCard
        v-for="script in scripts"
        :key="script._id"
        :post="script"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script>
import ScriptCard from "../components/ScriptCard.vue";  // ← FIXED: was BlogCard
import api from "../api";

export default {
  components: { ScriptCard },  // ← FIXED: was BlogCard
  data() {
    return {
      scripts: [],
    };
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem("token");
    },
  },
  async mounted() {
    await this.fetchScripts();
  },
  methods: {
    async fetchScripts() {
      try {
        const res = await api.get("/scripts");
        this.scripts = res.data;
      } catch (err) {
        console.error("Failed to fetch scripts", err);
      }
    },
    addScript() {
      // Navigate to add script page
      this.$router.push('/scripts/new');
    },
    async handleDelete(scriptId) {
      try {
        await api.delete(`/scripts/${scriptId}`);
        // Refresh the list
        await this.fetchScripts();
      } catch (error) {
        console.error("Failed to delete script", error);
        throw error;
      }
    },
  },
};
</script>