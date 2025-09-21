// composables/useArticle.js
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { computed } from "vue";
import gql from "graphql-tag";
import { useToastStore } from "@/stores/toast";

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

const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export function useArticle(postId) {
  const router = useRouter();
  const toast = useToastStore();

  // Récupération de l'article
  const { result, loading, error } = useQuery(GET_POST, { id: postId });
  const post = computed(() => result.value?.post || {});

  // Suppression de l'article
  const { mutate: deletePost } = useMutation(DELETE_POST);

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Tu es sûr de vouloir supprimer cet article ?"
    );
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

  return {
    post,
    loading,
    error,
    handleDelete,
  };
}
