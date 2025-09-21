// composables/useComments.js
import { useQuery, useMutation } from "@vue/apollo-composable";
import { ref, computed } from "vue";
import gql from "graphql-tag";
import { useToastStore } from "@/stores/toast";

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

const ADD_COMMENT = gql`
  mutation AddComment($text: String!, $post: ID!) {
    addComment(text: $text, post: $post) {
      id
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId)
  }
`;

export function useComments(postId) {
  const toast = useToastStore();

  // État local
  const commentsLimit = ref(5);
  const commentsOffset = ref(0);
  const commentText = ref("");

  // Récupération des commentaires
  const { result: commentsResult, refetch: refetchComments } = useQuery(
    GET_COMMENTS,
    () => ({
      postId,
      limit: commentsLimit.value,
      offset: commentsOffset.value,
    })
  );

  const comments = computed(() => commentsResult.value?.commentsByPost || []);

  // Mutations
  const { mutate: addComment } = useMutation(ADD_COMMENT);
  const { mutate: deleteComment } = useMutation(DELETE_COMMENT);

  // Actions
  const nextPage = () => {
    commentsOffset.value += commentsLimit.value;
    refetchComments();
  };

  const prevPage = () => {
    if (commentsOffset.value >= commentsLimit.value) {
      commentsOffset.value -= commentsLimit.value;
      refetchComments();
    }
  };

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

  return {
    // État
    comments,
    commentText,
    commentsLimit,
    commentsOffset,

    // Actions
    nextPage,
    prevPage,
    handleAddComment,
    handleDeleteComment,
  };
}
