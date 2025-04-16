<script setup>
import { useMutation } from "@vue/apollo-composable";
import { gql } from "graphql-tag";
import useAuthStore from "@/stores/auth";

const LOGIN_MUTATION = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

const authStore = useAuthStore();

function login(email, password) {
  loginMutate({ email, password }).then(({ data }) => {
    auth.setToken(data.login);
  });
}
</script>
