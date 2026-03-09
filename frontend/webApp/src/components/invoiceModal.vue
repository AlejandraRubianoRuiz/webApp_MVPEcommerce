<template>
  <div>
    <table class="table table-bordered mt-3">
      <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Unit price</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.quantity }}</td>
          <td>${{ item.unit_price }}</td>
          <td>${{ item.subtotal }}</td>
        </tr>
      </tbody>
    </table>
    <small class="mt-2"><strong>Date:</strong> {{formatDate(invoice.date_invoice) }}</small>
    <h4 class="text-end mt-4">Total: ${{ invoice.total_price }}</h4>
  </div>
</template>

<script>
import api from "../api";
export default {
    props: {
  invoiceId: {
    type: Number,
    required: true
  }
},
  data() {
    return {
      invoice: {},
      items: []
    };
  },
  methods: {
  formatDate(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
},
  async mounted() {
    //console.log(this.invoiceId);
    const resInvoice = await api.get(`/invoices/${this.invoiceId}`);
    this.invoice = resInvoice.data;

    const resItems = await api.get(`/invoiceItems/invoiceId/${this.invoiceId}`);
    this.items = resItems.data;

    for (const item of this.items) {
      const resProduct = await api.get(`/stocks/${item.product_id}`);
      item.name = resProduct.data.name;
    }
  }
};
</script>