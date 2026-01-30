<template>
  <div class="container blog-detail">
    <button class="btn back" @click="$router.push('/')">⟵ Back</button>
    
    <div v-if="post">
      <h2>{{ post.title }}</h2>
      <p>{{ post.content }}</p>
      
      <div class="author-info" v-if="post.author">
        <span>📝 By {{ post.author.username }}</span>
        <span>📅 {{ formatDate(post.createdAt) }}</span>
      </div>
      
      <div class="action-buttons" style="margin-top: 2rem;">
        <button v-if="canEdit" class="btn-edit" @click="editScript">
          ✏️ Edit Script
        </button>
        <button v-if="canDelete" class="btn-delete" @click="deleteScript">
          🗑️ Delete Script
        </button>
      </div>

      <div id="comments" class="comments-section">
        <h3>💬 Comments ({{ comments.length }})</h3>
        
        <div class="comment-form" v-if="isLoggedIn">
          <textarea 
            v-model="newComment"
            placeholder="Add your comment..."
            rows="4"
          ></textarea>
          <button class="btn-comment" @click="submitComment">
            💬 Post Comment
          </button>
        </div>
        <p v-else style="color: var(--text-gray); margin-top: 1rem;">
          Please <router-link to="/login" style="color: var(--neon-violet);">log in</router-link> to add comments.
        </p>

        <div 
          ref="commentList" 
          class="comments-scroll-container" 
          v-if="comments.length > 0"
        >
          <div 
            v-for="comment in comments" 
            :key="comment._id"
            class="comment-item"
          >
            <p class="comment-text">{{ comment.content }}</p>
            <div class="comment-meta">
              <span>👤 {{ comment.author }}</span>
              <span>📅 {{ formatDate(comment.createdAt) }}</span>
            </div>
            <button 
              v-if="canDeleteComment(comment)" 
              class="btn-delete-comment"
              @click="deleteComment(comment._id)"
              title="Delete comment"
            >
              🗑️
            </button>
          </div>
        </div>
        <p v-else style="color: var(--text-gray); text-align: center; padding: 2rem;">
          No comments yet. Be the first to comment!
        </p>
      </div>
    </div>
    
    <p v-else class="loading">Loading script...</p>
  </div>
</template>

<script>
import api from "../api";

export default {
  name: "ScriptDetail",
  data() {
    return {
      post: null,
      comments: [],
      newComment: "",
      currentUser: null,
    };
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem("token");
    },
    canEdit() {
      if (!this.isLoggedIn || !this.post) return false;
      return this.currentUser && this.post.author && 
             this.post.author.username === this.currentUser.username;
    },
    canDelete() {
      if (!this.isLoggedIn || !this.post) return false;
      return this.currentUser && (
        this.currentUser.isAdmin || 
        (this.post.author && this.post.author.username === this.currentUser.username)
      );
    },
  },
  // AUTO-SCROLL WATCHER: Triggers when the comments array changes
  watch: {
    comments() {
      this.$nextTick(() => {
        const container = this.$refs.commentList;
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        }
      });
    }
  },
  async mounted() {
    this.loadCurrentUser();
    await this.fetchPost();
    await this.fetchComments();
  },
  methods: {
    loadCurrentUser() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.currentUser = {
            id: payload.id,
            username: payload.username,
            isAdmin: payload.isAdmin
          };
        } catch (e) {
          console.error("Failed to decode token:", e);
        }
      }
    },
    async fetchPost() {
      try {
        const id = this.$route.params.id;
        const res = await api.get(`/scripts/${id}`);
        this.post = res.data;
      } catch (error) {
        this.$router.push('/');
      }
    },
    async fetchComments() {
      try {
        const id = this.$route.params.id;
        const res = await api.get(`/comments/${id}`);
        this.comments = res.data;
      } catch (error) {
        this.comments = [];
      }
    },
    async submitComment() {
      if (!this.newComment.trim()) return;
      try {
        const id = this.$route.params.id;
        await api.post(`/comments/${id}`, { content: this.newComment });
        this.newComment = "";
        await this.fetchComments();
      } catch (error) {
        alert("Failed to post comment.");
      }
    },
    canDeleteComment(comment) {
      if (!this.isLoggedIn || !this.currentUser) return false;
      return this.currentUser.isAdmin || comment.author === this.currentUser.username;
    },
    async deleteComment(commentId) {
      if (confirm('Delete this comment?')) {
        try {
          await api.delete(`/comments/${commentId}`);
          await this.fetchComments();
        } catch (error) {
          alert("Failed to delete comment");
        }
      }
    },
    editScript() {
      this.$router.push(`/scripts/${this.post._id}/edit`);
    },
    async deleteScript() {
      if (confirm('Are you sure you want to delete this script?')) {
        try {
          await api.delete(`/scripts/${this.post._id}`);
          this.$router.push('/');
        } catch (error) {
          alert("Failed to delete script");
        }
      }
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    },
  },
};
</script>

<style scoped>
.comments-scroll-container {
  max-height: 480px; 
  overflow-y: auto;
  padding-right: 15px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  scrollbar-width: thin;
  scrollbar-color: var(--neon-violet) transparent;
}

.comments-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.comments-scroll-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.comments-scroll-container::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--neon-violet), #7b2cbf);
  border-radius: 10px;
  box-shadow: 0 0 10px var(--neon-violet);
}

.comment-item {
  flex-shrink: 0; 
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(157, 78, 221, 0.2);
  position: relative;
  transition: all 0.3s ease;
}

.comment-item:hover {
  border-color: var(--neon-violet);
  box-shadow: 0 4px 20px rgba(157, 78, 221, 0.3);
}

.author-info {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(157, 78, 221, 0.1);
  border-radius: 8px;
  color: var(--text-gray);
  font-size: 0.9rem;
}

.comments-section {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 2px solid rgba(157, 78, 221, 0.3);
}

.comment-form textarea {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(157, 78, 221, 0.3);
  border-radius: 12px;
  color: var(--text-white);
  margin-bottom: 1rem;
}

.comment-meta {
  display: flex;
  gap: 2rem;
  font-size: 0.85rem;
  color: var(--text-gray);
  opacity: 0.7;
}

.btn-delete-comment {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.5;
}
</style>