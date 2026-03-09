<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand d-flex align-items-center" href="/Home">
      <img :src="logo" alt="LPA Logo" class="me-2" style="height: 40px" />
    </a>

    <div class="collapse navbar-collapse" id="navbarContent">
      <!-- Barra de búsqueda -->
      <form class="d-flex me-3" @submit.prevent="search">
        <input
          class="form-control me-2"
          type="search"
          v-model="query"
          placeholder="Buscar productos..."
        />
        <button class="btn btn-outline-primary" type="submit">Search</button>
      </form>

      <!-- Carrito -->
      <router-link to="/cart" class="btn btn-outline-success me-3">
        <span class="badge bg-primary">{{ cart.length }}</span>
        <i class="bi bi-cart"></i>
      </router-link>

      <!-- Perfil -->
      <div class="dropdown">
        <button
          class="btn btn-outline-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
        >
          <i class="bi bi-person-circle"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li>
            <router-link to="/profile" class="dropdown-item">Info</router-link>
          </li>
          <li>
            <button class="dropdown-item" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import logo from "../assets/logoApp.png";
export default {
  props: ["cart"],
  data() {
    return {
      query: "",
      logo,
    };
  },
  methods: {
    search() {
      this.$emit("search-products", this.query);
    },
    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      this.isLoggedIn = false;
      this.$router.push("/");
    },
  },
};
</script>