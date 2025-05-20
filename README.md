# 📰 AltTab — Blog Fullstack Vue.js / GraphQL / MongoDB

Bienvenue sur **AltTab**, un blog web moderne conçu avec Vue.js, GraphQL, Node.js et MongoDB.

Ce projet a été pensé pour permettre à des utilisateurs de publier, commenter et gérer des articles, mais aussi pour m’exercer à des technologies comme **Vue.js**, **GraphQL**, **MongoDB Atlas**, et le déploiement sur **Vercel** + **VPS Hostinger**.

#### Le site est encore en version bêta et présente quelques bugs mineures. Il sera amélioré bientôt.

---

## 🚀 Fonctionnalités

- 🧑‍💻 Authentification avec JWT (inscription, connexion, modification du profil)
- ✍️ Création et gestion d’articles (auteurs et admins)
- 💬 Système de commentaires (avec pagination et modération admin)
- 🏷️ Catégorisation des articles
- 🔍 Recherche d’articles par mots-clés
- 📂 Filtrage par catégories
- 🌗 Thème sombre / clair
- 🛡️ Sécurisation des routes côté front et API GraphQL
- 📦 API déployée sur un VPS (Nginx + Certbot + PM2)
- 🌐 Frontend déployé avec Vercel

---

## 🛠️ Stack technique

### Frontend

- [Vue 3](https://vuejs.org/)
- [Pinia](https://pinia.vuejs.org/) pour le state management
- [Tailwind CSS](https://tailwindcss.com/) pour le style
- [Apollo Client](https://apollo.vuejs.org/) pour GraphQL
- [Vercel](https://vercel.com/) pour le déploiement

### Backend

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [graphql-js](https://github.com/graphql/graphql-js)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) + Mongoose
- [JWT](https://jwt.io/) pour l’authentification
- [PM2](https://pm2.keymetrics.io/) pour garder le serveur actif
- [Nginx](https://www.nginx.com/) pour le reverse proxy HTTPS

---

## 🔒 Rôles utilisateurs

- `utilisateur` : lecture des articles, ajout de commentaires
- `auteur` : création et suppression de ses propres articles
- `admin` : gestion des utilisateurs, articles, commentaires et catégories

---

## 📄 Pages principales

- `/` – Accueil avec articles récents
- `/articles` – Liste complète avec pagination + filtre + recherche
- `/articles/:id` – Détail d’un article + commentaires
- `/nouvel-article` – Formulaire de création (auteur/admin)
- `/profil` – Page utilisateur (modifier nom et mot de passe)
- `/admin` – Dashboard admin (utilisateurs, articles, commentaires, catégories)
- `/a-propos`, `/mentions-legales`, `/contact` – Pages statiques

---
