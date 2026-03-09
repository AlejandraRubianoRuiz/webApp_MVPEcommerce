<template>
  <div class="row me-2 mt-3">
    <div class="card product-card shadow-sm">
      <img
        :src="
          product.image_url
            ? `http://localhost:3000${product.image_url}`
            : '/default.png'
        "
        class="card-img-top"
        alt="Product image"
      />
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">{{ product.name }}</h5>
        <p class="card-text text-muted flex-grow-1">
          {{ product.description }}
        </p>
        <div class="mt-auto d-flex justify-content-between align-items-center">
          <span class="fw-bold text-primary">
            ${{
              isNaN(product.price) ? "0.00" : Number(product.price).toFixed(2)
            }}
          </span>
          <button
            class="btn btn-sm btn-success"
            @click="$emit('add-to-cart', product)"
          >
            <i class="bi bi-cart-plus"></i> Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  methods: {},
};
</script>

<style scoped>
.card-img-top {
  object-fit: cover;
  height: 200px;
}
</style>