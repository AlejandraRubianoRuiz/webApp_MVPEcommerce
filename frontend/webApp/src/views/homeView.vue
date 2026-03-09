<template>
  <div class="container">
    <div>
      <Navbar :cart="cart" @search-products="handleSearch" />
      <div class="row row-cols-1 row-cols-md-3 g-4 mt-2">
        <ProductCard
          v-for="item in filteredProducts"
          :key="item.id"
          :product="item"
          @add-to-cart="handleAddToCart"
        />
      </div>
      <Footer />
    </div>
  </div>
</template>

<script>
import api from "../api";
import Navbar from "../components/navbar.vue";
import Footer from "../components/footer.vue";
import ProductCard from "../components/productCard.vue";

export default {
  name: "Home",
  components: {
    Navbar,
    Footer,
    ProductCard,
  },
  props: {
    cart: Array,
    handleAddToCart: Function,
  },
  data() {
    return {
      isLoggedIn: false,
      products: [],
      searchQuery: "",
    };
  },
  computed: {
    filteredProducts() {
      if (!this.searchQuery) return this.products;
      const query = this.searchQuery.toLowerCase();
      return this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query)
      );
    },
  },
  mounted() {
    const token = localStorage.getItem("token"); // 👈 aquí guardaste el token en el login
    api
      .get("/stocks", {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 se envía el token en el header
        },
      })
      .then((res) => {
        this.products = res.data;
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
      });

    const user = localStorage.getItem("user");
    if (user) {
      this.isLoggedIn = true;
    }
  },
  methods: {
    handleSearch(query) {
      console.log("desde el padre" + query);
      this.searchQuery = query; // 👈 actualiza el filtro
    },
  },
};
</script>