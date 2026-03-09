<template>
  <div
    class="d-flex justify-content-center align-items-center bg-light"
    style="height: 100vh"
  >
    <div class="card shadow p-3" style="width: 100%; max-width: 450px">
      <div class="text-center mb-4">
        <img :src="logo" alt="LPA Logo" style="height: 100px" />
      </div>
      <h4 class="text-center mb-4">Log In</h4>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            id="email"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Password</label>
          <div class="input-group" style="align-items: stretch">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              class="form-control"
              required
              style="margin: 0"
            />
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="showPassword = !showPassword"
              style="margin: 0; padding-top: 0.375rem; padding-bottom: 0.375rem"
            >
              <i
                :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
                style="font-size: 1.2rem"
              ></i>
            </button>
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-100">Log in</button>
        <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
          {{ errorMessage }}
        </div>
      </form>
      <div class="text-center mt-3">
        <router-link to="/register" class="btn btn-outline-secondary w-100">
          ¿Do not have an account? Register
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api";
import logo from "../assets/logoApp.png";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      showPassword: false,
      logo,
    };
  },
  methods: {
    async handleLogin() {
      try {
        const res = await api.post("/auth/login", {
          email: this.email,
          password: this.password,
        });
        //console.log("Login:", res.data);
        // Guarda los datos del usuario en localStorage
        localStorage.setItem("user", JSON.stringify(res.data));
        //Guardar token
        const token = res.data.token;
        localStorage.setItem("token", token);
        //Validar rol del usuario
        const rol = res.data.role;
        if (rol === "admin") {
          this.$router.push("/admin/home"); // ruta administrativa
        } else {
          this.$router.push("/Home"); // ruta principal
        }
        // comunica al padre que el login fue exitoso
        this.$emit("login-success", res.data);
      } catch (err) {
        this.errorMessage = err.response?.data?.error || "Login error";
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
}
input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>