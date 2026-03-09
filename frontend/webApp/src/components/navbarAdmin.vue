<template>
  <nav
    class="sidebar bg-light p-3 d-flex flex-column justify-content-between"
    style="min-height: 100vh"
  >
    <div>
      <h5>Admin panel</h5>
      <p class="text-muted">👤 {{ nombreAdmin }}</p>
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link to="/admin/home" class="nav-link" active-class="active"
            >🛒 Products</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            to="/admin/invoices"
            class="nav-link"
            active-class="active"
            >📄 Invoices</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            to="/admin/clients"
            class="nav-link"
            active-class="active"
            >👥 Clients</router-link
          >
        </li>
      </ul>
    </div>
    <div>
      <button class="btn btn-outline-danger w-100 mt-3" @click="logOut">
        Log Out
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      nombreAdmin: "",
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("user"));
    this.nombreAdmin = user?.name || "Admin";
  },
  methods: {
    logOut() {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.nav-link.active {
  font-weight: bold;
  color: #0d6efd;
}
</style>