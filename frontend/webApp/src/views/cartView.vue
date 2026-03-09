<template>
  <div class="container">
    <Navbar :cart="cart" />
    <h2 class="mb-4">🛒 Shopping cart</h2>

    <div v-if="cart.length">
      <div class="card mb-3" v-for="item in cart" :key="item.id">
        <div class="row g-0">
          <div class="col-md-2">
            <img
              :src="`http://localhost:3000${item.image_url}`"
              class="img-fluid rounded-start"
              alt="Imagen del producto"
              style="height: 100px; object-fit: cover"
            />
          </div>
          <div class="col-md-10">
            <div class="card-body">
              <h5 class="card-title">{{ item.name }}</h5>
              <p class="card-text mb-1">Unit price: ${{ item.price }}</p>
              <p class="card-text mb-1 text-muted">
                Available units: {{ item.stock }}
              </p>

              <div class="d-flex align-items-center gap-2">
                <button
                  class="btn btn-sm btn-outline-secondary"
                  @click="decreaseQuantity(item)"
                  :disabled="item.quantity <= 1"
                >
                  −
                </button>
                <span>{{ item.quantity }}</span>
                <button
                  class="btn btn-sm btn-outline-secondary"
                  @click="increaseQuantity(item)"
                  :disabled="item.quantity >= item.stock"
                >
                  +
                </button>
                <button
                  class="btn btn-sm btn-danger ms-3"
                  @click="removeItem(item.id)"
                >
                  Remove
                </button>
              </div>

              <p class="card-text mt-2">
                Subtotal: ${{ item.price * item.quantity }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-end">
        <h4>Total: ${{ total }}</h4>
        <button class="btn btn-success mt-2" @click="endAndPay" :disabled="isPaying">Pay</button>
      </div>
    </div>

    <div v-else>
      <p>Shopping cart empty.</p>
    </div>

     <div v-if="showModal" class="modal-backdrop-custom">
      <div class="modal-dialog-custom">
        <div class="modal-content p-4 bg-white rounded shadow">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4>Payment details</h4>
            <button class="btn btn-sm btn-outline-danger" @click="closeModal">✖</button>
          </div>
          <InvoiceModal :invoice-id="this.invoiceId" />
        </div>
      </div>
    </div>
    <Footer />
    
  </div>
</template>

<script>
import Navbar from "../components/navbar.vue";
import Footer from "../components/footer.vue";
import InvoiceModal from "../components/invoiceModal.vue"
import api from "../api";

export default {
  components: { Navbar, Footer, InvoiceModal },
  props: ["cart"],
  data() {
    return {
      showModal: false,
      invoiceId: null,
      isPaying: false,
    };
  },
  computed: {
    total() {
      return this.cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
  },
  methods: {
    increaseQuantity(item) {
      if (item.quantity < item.stock) {
        item.quantity += 1;
      }
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    removeItem(id) {
      const index = this.cart.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.cart.splice(index, 1);
      }
    },

    async endAndPay() {
       if (this.isPaying) return; // evita doble ejecución
       this.isPaying = true;

      try {
        const total = this.cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        //console.log(this.getUserId());
        //console.log(new Date());
        //console.log(total);
        // 1. Crear la factura
        const invoiceRes = await api.post("/invoices", {
          user_id: this.getUserId(), // método que obtenga el usuario actual
          date_invoice: new Date().toISOString().slice(0, 19).replace("T", " "),
          total_price: total,
        });

        this.invoiceId = invoiceRes.data.id;
        //console.log(this.invoiceId);

        // 2. Insertar los ítems
        for (const item of this.cart) {
          await api.post("/invoiceItems", {
            invoice_id: this.invoiceId,
            product_id: item.id,
            quantity: item.quantity,
            unit_price:item.price,
            subtotal: item.price * item.quantity,
          });

          // 3. (Opcional) Actualizar el stock
          await api.put(`/stocks/${item.id}`, {
            quantity: item.stock - item.quantity,
          });
        }

        // 4. Limpiar carrito y redirigir
        this.cart.splice(0, this.cart.length);
        this.showModal = true; 
        //this.$router.push(`/invoice/${invoiceId}`);
      } catch (error) {
        console.error("Error al finalizar compra:", error);
      }finally {
    this.isPaying = false; // vuelve a habilitar el botón
     }
    },
    getUserId() {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.userId || null;
    },
    closeModal() {
      this.showModal = false;
      // 👇 Aquí puedes recargar productos o carrito si es necesario
      //this.cargarProductos(); // o this.actualizarCarrito()
    },
  },
};
</script>
<style scoped>
.modalStyle {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 1050;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>