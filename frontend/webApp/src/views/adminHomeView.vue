<template>
  <div class="admin-layout d-flex">
    <!-- Menú lateral -->
    <Navbar />

    <!-- Contenido principal -->
    <main class="content flex-grow-1 p-4">
      <h3>Products 💻</h3>
      <!-- Aquí va tu contenido dinámico -->
      <div>
        <!-- Botón Añadir producto -->
        <div class="container mt-2 position-relative" style="min-height: 30px">
          <button
            class="btn btn-success position-absolute top-0 end-0 me-3 mt-2"
            @click="showModal = true"
          >
            ➕ Add product
          </button>
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="modal-backdrop-custom">
          <div class="modal-dialog-custom">
            <div class="modal-content p-4 bg-white rounded shadow">
              <div
                class="d-flex justify-content-between align-items-center mb-3"
              >
                <h5>New product</h5>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="this.showModal = false"
                >
                  ✖
                </button>
              </div>
              <form @submit.prevent="createProduct">
                <input
                  v-model="newP.name"
                  placeholder="Product name"
                  class="form-control mb-2"
                />
                <input
                  v-model="newP.description"
                  placeholder="Product description"
                  class="form-control mb-2"
                />
                <input
                  v-model="newP.reference"
                  placeholder="Reference"
                  class="form-control mb-2"
                />
                <input
                  v-model="newP.brand"
                  placeholder="Brand"
                  class="form-control mb-2"
                />
                <!-- Precio -->
                <div class="d-flex align-items-center mb-2">
                  <label class="me-2" style="width: 100px">Unit price:</label>
                  <input
                    v-model.number="newP.price"
                    type="number"
                    placeholder="Price"
                    class="form-control"
                  />
                </div>

                <!-- Cantidad -->
                <div class="d-flex align-items-center mb-2">
                  <label class="me-2" style="width: 100px">Quantity:</label>
                  <input
                    v-model.number="newP.quantity"
                    type="number"
                    placeholder="Initial stock"
                    class="form-control"
                  />
                </div>

                <!-- Imagen -->
                <div class="d-flex align-items-center mb-2">
                  <label class="form-label">Product image:</label>
                  <input
                    type="file"
                    @change="handleImageUpload"
                    class="form-control"
                  />
                </div>

                <button class="btn btn-primary">Save</button>
              </form>
            </div>
          </div>
        </div>

        <!-- Tarjetas de productos -->
        <div class="row mt-5">
          <div class="col-md-4 mb-4" v-for="p in products" :key="p.id">
            <div class="card h-100 shadow-sm d-flex flex-column">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ p.name }}</h5>
                <img
                  :src="
                    p.image_url
                      ? `http://localhost:3000${p.image_url}`
                      : '/default.png'
                  "
                  class="card-img-top"
                  alt="Product image"
                  style="
                    width: 250px;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 8px;
                  "
                />
                <p class="card-text">Price: ${{ p.price }}</p>
                <h5 class="card-text">Available stock: {{ p.quantity }}</h5>
                <p class="card-text">Description: {{ p.description }}</p>

                <!-- Botones al fondo -->
                <div class="mt-auto d-flex justify-content-between">
                  <button
                    class="btn btn-sm btn-primary"
                    @click="addStock(p.id)"
                  >
                    + Stock
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="deleteStock(p.id)"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
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
      products: [],
      newP: {
        name: "",
        description: "",
        quantity: 0,
        refrence: "",
        price: 0,
        brand: "",
        image_url: "",
      },
      showModal: false,
    };
  },
  async mounted() {
    const token = localStorage.getItem("token");
    this.loadStocks();
  },
  methods: {
    async loadStocks() {
      try {
        const token = localStorage.getItem("token"); // 👈 el token guardado al hacer login
        const res = await api.get("/stocks", {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 se envía el token en el header
          },
        });
        this.products = res.data;
      } catch (err) {
        console.error("Error loading products.", err);
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.newP.image = file;
    },
    async createProduct() {
      const formData = new FormData();
      formData.append("name", this.newP.name);
      formData.append("description", this.newP.description);
      formData.append("reference", this.newP.reference);
      formData.append("brand", this.newP.brand);
      formData.append("price", this.newP.price);
      formData.append("quantity", this.newP.quantity);
      if (this.newP.image) {
        formData.append("image", this.newP.image);
      }

      await api.post("/stocks", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      this.showModal = false;
      this.resetForm();
      this.loadStocks();
    },
    resetForm() {
      this.newP = {
        name: "",
        description: "",
        reference: "",
        brand: "",
        price: 0,
        quantity: 0,
        image: null,
      };
    },
    async addStock(id) {
      await api.put(`/stocks/increaseStock/${id}`);
      this.loadStocks();
    },
    async deleteStock(id) {
      await api.delete(`/stocks/${id}`);
      this.loadStocks();
    },
  },
};
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-dialog-custom {
  max-width: 500px;
  width: 90%;
}
</style>