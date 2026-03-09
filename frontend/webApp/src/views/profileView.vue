<template>
  <div>
    <Navbar :cart="cart"/>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>My profile</h3>
      <button class="btn btn-sm btn-outline-primary" @click="modoEdicion = !modoEdicion">
        <i class="bi bi-pencil"></i> <!-- Bootstrap Icons -->
      </button>
    </div>

    <form @submit.prevent="guardarCambios">
      <div class="mb-3 d-flex align-items-center">
        <label class=" me-2 form-label"  style="width:400px;">Name:</label>
        <input
          v-model="usuario.name"
          :readonly="!modoEdicion"
          type="text"
          class="form-control"
        />
      </div>
      <div class="mb-3 d-flex align-items-center">
        <label class="form-label" style="width: 400px;" >Email:</label>
        <input
          v-model="usuario.email"
          :readonly="!modoEdicion"
          type="email"
          class="form-control"
        />
      </div>
      <div class="mb-3 d-flex align-items-center">
        <label class="form-label" style="width: 400px;" >Address:</label>
        <input
          v-model="usuario.address"
          :readonly="!modoEdicion"
          type="text"
          class="form-control"
        />
      </div>
        
    <div class="mb-3 d-flex align-items-center">
        <label class="form-label" style="width: 400px;">Phone:</label>
        <input
          v-model="usuario.phone"
          :readonly="!modoEdicion"
          type="text"
          class="form-control"
        />
      </div>

      <button v-if="modoEdicion" type="submit" class="btn btn-success" @click="saveChanges()">Save</button>
    </form>
    <Footer/>
  </div>
  </div>
</template>

<script>
import api from "../api";
import Navbar from "../components/navbar.vue";
import Footer from "../components/footer.vue";

export default {
components:{Navbar, Footer},
  props: ["cart"],
  data() {
    return {
      usuario: {
        id:null,
        name: '',
        email: '',
        address: '',
        phone:'',
      },
      modoEdicion: false
    };
  },
  async mounted() {
    const userData = JSON.parse(localStorage.getItem('user'));
  this.id = userData.userId;
  const res = await api.get(`/users/${this.id}`);
  this.usuario = res.data;
  },
  methods: {
    async saveChanges() {
      await api.put(`/users/${this.id}`, this.usuario);
      this.modoEdicion = false;
      alert('Info updated');
    },
  }
};
</script>