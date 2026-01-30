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
        v-for="script in posts"
        :key="script._id"
        :post="script"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script>
import ScriptCard from "../components/ScriptCard.vue";
import api from "../api";

export default {
  components: { ScriptCard },
  data() {
    return { posts: [] };
  },
  computed: {
    isLoggedIn() { return !!localStorage.getItem("token"); },
  },
  async mounted() {
    await this.fetchScripts();
  },
  methods: {
    async fetchScripts() {
      try {
        const res = await api.get("/scripts");
        this.posts = res.data;
      } catch (err) {
        console.error("Failed to fetch", err);
      }
    },
    addScript() { this.$router.push('/scripts/new'); },
    async handleDelete(scriptId) {
      try {
        await api.delete(`/scripts/${scriptId}`);
        await this.fetchScripts();
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>