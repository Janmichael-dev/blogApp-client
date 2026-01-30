<template>
  <div class="blog-card" @click="goToDetails">
    <h3>{{ post.title }}</h3>
    <p>{{ contentPreview }}</p>
    
    <div class="card-meta" v-if="post.author">
      <span class="author-tag">
        👤 <span class="author-name">{{ post.author.username }}</span>
      </span>
      <span>📅 {{ formatDate(post.createdAt) }}</span>
    </div>
    
    <div class="action-buttons">
      <button v-if="canEdit" class="btn-edit" @click.stop="editScript">✏️ Edit</button>
      <button v-if="canDelete" class="btn-delete" @click.stop="deleteScript">🗑️ Delete</button>
      
      <button v-if="isLoggedIn" class="btn-comment" @click.stop="addComment">💬 Comment</button>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";

export default {
  props: { post: Object },
  setup() {
    const toast = useToast();
    return { toast };
  },
  computed: {
    isLoggedIn() { return !!localStorage.getItem("token"); },
    currentUser() {
      const token = localStorage.getItem("token");
      if (!token) return null;
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (e) { return null; }
    },
    canEdit() {
      return this.isLoggedIn && this.post.author?.username === this.currentUser?.username;
    },
    canDelete() {
      return this.isLoggedIn && (this.currentUser?.isAdmin || this.post.author?.username === this.currentUser?.username);
    },
    contentPreview() {
      if (!this.post.content) return '';
      return this.post.content.length > 250 
        ? this.post.content.substring(0, 250) + '...'
        : this.post.content;
    }
  },
  methods: {
    goToDetails() { this.$router.push(`/scripts/${this.post._id}`); },
    editScript() { this.$router.push(`/scripts/${this.post._id}/edit`); },
    
    // This now correctly navigates to the detail page's comment section
    addComment() { 
      this.$router.push(`/scripts/${this.post._id}`).then(() => {
        // Optional: slight delay to let page load before scrolling to hash
        window.location.hash = 'comments';
      });
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    async deleteScript() {
      if (confirm('Are you sure you want to delete this script?')) {
        try {
          this.$emit('delete', this.post._id);
          this.toast.success("Script deleted successfully 🗑️");
        } catch (error) {
          this.toast.error("Failed to delete script");
        }
      }
    },
  },
};
</script>