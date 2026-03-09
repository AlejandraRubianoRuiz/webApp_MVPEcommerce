<template>
<div class="admin-layout d-flex">
<Navbar/>
      <main class="content flex-grow-1 p-4">
  <div class="container mt-1">
    <h3 class="mb-3">📄 Invoices</h3>
    <div v-for="invoice in invoices" :key="invoice.id" class="card mb-4 shadow-sm">
      <div class="card-header bg-primary text-white">
        <strong>Invoice #{{ invoice.id }}</strong> — {{ new Date(invoice.date).toLocaleDateString('es-US') }}
      </div>

      <div class="card-body">
        <p><strong>Client:</strong> {{ invoice.client.name }} ({{ invoice.client.email }})</p>

        <table class="table table-sm table-bordered">
          <thead class="table-light">
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in invoice.stocks" :key="item.id">
              <td>{{ item.name }}</td>
              <td>${{ item.unit_price.toFixed(2) }}</td>
              <td>{{ item.quantity }}</td>
              <td>${{ item.subtotal.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="text-end fw-bold">
          Total: ${{ calcularTotal(invoice.stocks).toFixed(2) }}
        </div>
      </div>
    </div>
  </div>
    <Footer/>
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
      invoices: []
    };
  },
  async mounted() {
    try {
      const res = await api.get('/invoices/details'); // ajusta si usas otro endpoint
      this.invoices = res.data;
      console.log(res.data);
    } catch (err) {
      console.error('Error loading invoices', err);
    }
  },
  methods: {
    calcularTotal(items) {
      return items.reduce((acc, item) => acc + item.subtotal, 0);
    }
  }
};
</script>