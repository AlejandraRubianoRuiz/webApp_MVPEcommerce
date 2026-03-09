<script>
export default {
  name: "App",
  data() {
    return {
      cart: [],
    };
  },
  methods: {
    handleAddToCart(product) {
  const existing = this.cart.find(item => item.id === product.id);
  if (existing) {
    if (existing.quantity < product.quantity) {
      existing.quantity += 1;
    }
  } else {
    this.cart.push({
      ...product,
      quantity: 1,
      stock: product.quantity // ← este es el stock disponible
    });
  }
},
  }
};
</script>

<template>
  <router-view :cart="cart" :handle-add-to-cart="handleAddToCart" />
</template>