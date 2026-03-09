<template>
  <div class="d-flex justify-content-center align-items-center vh-60 bg-light">
    <div class="card shadow p-4" style="width: 100%; max-width: 500px">
      <h4 class="text-center mb-4">Sign In</h4>
      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label class="form-label">Full name</label>
          <input
            v-model="form.name"
            type="text"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Password</label>
          <div class="input-group">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="form.password"
              class="form-control"
              required
              :class="{ 'is-invalid': passwordError }"
            />
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>

          <div class="form-text text-muted mt-1">
            Password must be at least 8 characters long and include:
            <ul class="mb-0">
              <li>One uppercase letter</li>
              <li>One number</li>
              <li>One special character (e.g. ! @ # $ %)</li>
            </ul>
          </div>

          <div v-if="passwordError" class="invalid-feedback d-block">
            Password does not meet the required criteria.
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Gender</label>
          <select v-model="form.gender" class="form-select" required>
            <option disabled value="">Select an option</option>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Phone number</label>
          <input
            v-model="form.phone"
            type="tel"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Address</label>
          <input
            v-model="form.address"
            type="text"
            class="form-control"
            required
          />
        </div>

        <button type="submit" class="btn btn-success w-100">Sing in</button>

        <div v-if="errorMessage" class="alert alert-danger mt-3">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="alert alert-success mt-3">
          {{ successMessage }}
        </div>
      </form>
      <router-link to="/" class="btn btn-link mt-3">
        Already have an account? Log in
      </router-link>
    </div>
  </div>
</template>

<script>
import api from "../api";

export default {
  name: "Register",
  data() {
    return {
      showPassword: false,
      form: {
        name: "",
        email: "",
        password: "",
        gender: "",
        phone: "",
        address: "",
      },
      errorMessage: "",
      successMessage: "",
    };
  },
  computed: {
    passwordError() {
      const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      return this.form.password && !regex.test(this.form.password);
    },
  },
  methods: {
    async handleRegister() {
      if (this.passwordError) {
        this.errorMessage =
          "The password does not match with the requirements.";
        return;
      }

      try {
        const res = await api.post("/users", this.form);
        this.successMessage = "User register successful!";
        this.errorMessage = "";
        this.form = {
          name: "",
          email: "",
          password: "",
          gender: "",
          phone: "",
          address: "",
        };
      } catch (err) {
        this.errorMessage =
          err.response?.data?.error || "Error, user not registered.";
        this.successMessage = "";
      }
    },
  },
};
</script>