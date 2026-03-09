<template>
  <div class="admin-layout d-flex">
    <Navbar />
    <main class="content flex-grow-1 p-4">
       <h3 class="mb-4">👥 Clients</h3>
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        <div
          v-for="client in clients"
          :key="client.id"
          class="card m-2 shadow-sm col"
        >
          <div class="card-header bg-success text-white">
            {{ client.name }}
          </div>
          <div class="card-body">
            <p><strong>Email:</strong> {{ client.email }}</p>
            <p><strong>Phone:</strong> {{ client.phone || "N/A" }}</p>
            <p><strong>Invoices:</strong> {{ client.total_invoices }}</p>
            <p>
              <strong>Total in purchases:</strong> ${{
                client.total_buys.toFixed(2)
              }}
            </p>
            <p>
              <strong>Date of last buy:</strong>
              {{ formatDate(client.last_buy) }}
            </p>
          </div>
          <i class="bi bi-person-circle fs-4 text-secondary text-end me-3"></i>
        </div>
      </div>
      <Footer />
    </main>
  </div>
</template>
<script>
import api from "../api";
import Navbar from "../components/navbarAdmin.vue";
import Footer from "../components/footer.vue";
export default {
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      clients: [],
    };
  },
  async mounted() {
    const res = await api.get("/users/summary"); // ajusta según tu endpoint
    this.clients = res.data;
  },
  methods: {
    formatDate(fechaISO) {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleDateString("es-US");
    },
  },
};
</script>
