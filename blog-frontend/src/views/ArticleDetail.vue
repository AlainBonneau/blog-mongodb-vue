<script>
import CommentItem from "../components/comments/CommentItem.vue";
import CommentForm from "../components/comments/CommentForm.vue";
import CommentList from "../components/comments/CommentList.vue";
</script>

<template>
  <section class="max-w-4xl mx-auto px-4 py-16">
    <div v-if="loading" class="text-center text-wprimary">Chargement...</div>
    <div v-else-if="error" class="text-center text-red-500">
      Erreur : {{ error.message }}
    </div>

    <article
      v-else
      class="bg-whitebg dark:bg-blackbg p-8 rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700"
    >
      <img
        v-if="post.image"
        :src="post.image"
        :alt="post.title"
        class="w-full h-64 object-cover rounded-lg mb-6"
      />

      <div
        v-if="
          auth.user &&
          (auth.user.userId === post.author?.id || auth.user.role === 'admin')
        "
        class="mt-6 text-right"
      >
        <button
          @click="handleDelete"
          class="px-4 py-2 mb-4 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
        >
          Supprimer l'article
        </button>
      </div>

      <h1 class="text-3xl font-bold text-wprimary dark:text-wtext mb-4">
        {{ post.title }}
      </h1>

      <div class="text-sm text-gray-600 dark:text-wtext mb-6">
        Catégorie :
        <span class="font-semibold">{{
          post.category?.name || "Non spécifiée"
        }}</span>
        — Auteur :
        <span class="italic">{{ post.author?.name || "Anonyme" }}</span>
      </div>

      <!-- Contenu Markdown amélioré -->
      <div
        class="prose prose-lg dark:prose-invert max-w-none prose-headings:text-wprimary dark:prose-headings:text-wtext prose-p:text-gray-800 dark:prose-p:text-wtext prose-strong:text-wprimary dark:prose-strong:text-wtext prose-em:text-gray-700 dark:prose-em:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-wprimary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-ul:my-4 prose-ol:my-4 prose-li:my-2 prose-hr:border-gray-300 dark:prose-hr:border-gray-700 prose-table:border-collapse prose-table:w-full prose-table:my-6 prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-600 prose-th:bg-gray-50 dark:prose-th:bg-gray-800 prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-600 prose-td:p-3"
        v-html="htmlContent"
      ></div>

      <!-- 💬 Commentaires -->
      <section class="mt-12">
        <CommentList
          :comments="comments"
          :auth="auth"
          :limit="commentsLimit"
          :offset="commentsOffset"
          @prevPage="prevPage"
          @nextPage="nextPage"
          @delete="handleDeleteComment"
        />

        <!-- Ajouter un commentaire -->
        <CommentForm
          v-if="auth.isLoggedIn"
          :text="commentText"
          @update:text="commentText = $event"
          @submit="handleAddComment"
        />
        <p v-else class="text-sm text-gray-600 mt-4">
          Connecte-toi pour commenter.
        </p>
      </section>
    </article>
  </section>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { useQuery, useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useToastStore } from "@/stores/toast";
import { marked } from "marked";
import DOMPurify from "dompurify";

const router = useRouter();
const route = useRoute();
const postId = route.params.id;
const auth = useAuthStore();
const toast = useToastStore();

// Configuration améliorée de marked
marked.setOptions({
  breaks: true,
  gfm: true, // GitHub Flavored Markdown
  headerIds: true,
  mangle: false,
  pedantic: false,
  sanitize: false, // On utilise DOMPurify à la place
  silent: false,
  smartLists: true,
  smartypants: true, // Typographie intelligente
  xhtml: false,
});

// Renderer personnalisé pour des améliorations
const renderer = new marked.Renderer();

// Liens externes s'ouvrent dans un nouvel onglet
renderer.link = (href, title, text) => {
  // Vérification que href est une string valide
  if (!href || typeof href !== "string") {
    href = "#";
  }

  const isExternal = href && !href.startsWith("/") && !href.startsWith("#");
  const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
  const titleAttr = title ? ` title="${title}"` : "";
  return `<a href="${href}"${titleAttr}${target}>${text}</a>`;
};

// Code blocks avec classes pour le highlighting (correction du bug)
renderer.code = (code, language) => {
  // S'assurer que code est une string
  const codeContent = typeof code === "string" ? code : String(code);
  const validLanguage =
    language &&
    typeof language === "string" &&
    language.match(/^[a-zA-Z0-9_-]+$/);
  const langClass = validLanguage ? ` class="language-${language}"` : "";

  // Échapper le HTML dans le code
  const escapedCode = codeContent
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  return `<pre><code${langClass}>${escapedCode}</code></pre>`;
};

// Améliorer le rendu des tableaux
renderer.table = (header, body) => {
  return `<table class="w-full border-collapse my-6">
    <thead>${header}</thead>
    <tbody>${body}</tbody>
  </table>`;
};

renderer.tablerow = (content) => {
  return `<tr>${content}</tr>`;
};

renderer.tablecell = (content, flags) => {
  const tag = flags.header ? "th" : "td";
  const align = flags.align ? ` style="text-align: ${flags.align}"` : "";
  return `<${tag}${align}>${content}</${tag}>`;
};

marked.use({ renderer });

// Contenu HTML traité avec DOMPurify
const htmlContent = computed(() => {
  if (!post.value.content) return "";

  try {
    // Conversion Markdown vers HTML
    const rawHtml = marked(post.value.content);

    // Sanitisation avec DOMPurify
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "br",
        "strong",
        "em",
        "u",
        "del",
        "s",
        "a",
        "img",
        "video",
        "audio",
        "ul",
        "ol",
        "li",
        "blockquote",
        "pre",
        "code",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "hr",
        "div",
        "span",
      ],
      ALLOWED_ATTR: [
        "href",
        "src",
        "alt",
        "title",
        "class",
        "target",
        "rel",
        "id",
        "style",
        "controls",
        "width",
        "height",
      ],
      ALLOW_DATA_ATTR: false,
    });

    return cleanHtml;
  } catch (error) {
    console.error("Erreur lors du rendu Markdown:", error);
    return "<p>Erreur lors du rendu du contenu</p>";
  }
});

// Get post
const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      image
      category {
        name
      }
      author {
        id
        name
      }
    }
  }
`;
const { result, loading, error } = useQuery(GET_POST, { id: postId });
const post = computed(() => result.value?.post || {});

// Get comments
const GET_COMMENTS = gql`
  query CommentsByPost($postId: ID!, $limit: Int, $offset: Int) {
    commentsByPost(postId: $postId, limit: $limit, offset: $offset) {
      id
      text
      author {
        name
      }
    }
  }
`;

const commentsLimit = ref(5);
const commentsOffset = ref(0);

const { result: commentsResult, refetch: refetchComments } = useQuery(
  GET_COMMENTS,
  () => ({
    postId,
    limit: commentsLimit.value,
    offset: commentsOffset.value,
  })
);

const comments = computed(() => commentsResult.value?.commentsByPost || []);

function nextPage() {
  commentsOffset.value += commentsLimit.value;
  refetchComments();
}

function prevPage() {
  if (commentsOffset.value >= commentsLimit.value) {
    commentsOffset.value -= commentsLimit.value;
    refetchComments();
  }
}

// Add comment
const ADD_COMMENT = gql`
  mutation AddComment($text: String!, $post: ID!) {
    addComment(text: $text, post: $post) {
      id
    }
  }
`;
const commentText = ref("");
const { mutate: addComment } = useMutation(ADD_COMMENT);

const handleAddComment = async () => {
  if (!commentText.value.trim()) return;
  try {
    await addComment({ text: commentText.value, post: postId });
    commentText.value = "";
    await refetchComments();
    toast.showToast("Commentaire ajouté avec succès !", "success");
  } catch (err) {
    console.error("Erreur ajout commentaire :", err);
    toast.showToast("Erreur : " + err.message, "error");
  }
};

// Delete post
const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const { mutate: deletePost } = useMutation(DELETE_POST);

const handleDelete = async () => {
  const confirmDelete = confirm("Tu es sûr de vouloir supprimer cet article ?");
  if (!confirmDelete) return;

  try {
    await deletePost({ postId });
    router.push("/articles");
    toast.showToast("Article supprimé avec succès !", "success");
  } catch (err) {
    console.error("Erreur suppression article :", err);
    toast.showToast("Erreur : " + err.message, "error");
  }
};

// Delete comment
const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId)
  }
`;

const { mutate: deleteComment } = useMutation(DELETE_COMMENT);

const handleDeleteComment = async (commentId) => {
  const ok = confirm("Supprimer ce commentaire ?");
  if (!ok) return;

  try {
    await deleteComment({ commentId });
    await refetchComments();
    toast.showToast("Commentaire supprimé avec succès !", "success");
  } catch (err) {
    console.error("Erreur suppression commentaire :", err);
    toast.showToast("Erreur : " + err.message, "error");
  }
};
</script>
