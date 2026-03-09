import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/loginView.vue";
import Home from "../views/homeView.vue";
import Register from "../components/register.vue";
import Cart from "../views/cartView.vue";
import Profile from "../views/profileView.vue";
import AdminHome from "../views/adminHomeView.vue";
import AdminInvoice from "../views/adminInvoicesView.vue";
import AdminClients from "../views/adminClientsView.vue";

//import Dashboard from '../components/Dashboard.vue'; // crea este componente después

const routes = [
  {path: "/", component:Login, props:true},
  { path: "/home", component: Home, props: true  },
  { path: "/register", component: Register },
  { path: "/cart", component: Cart , props: true },
  { path: "/profile", component: Profile , props: true },
  { path: "/admin/home", component: AdminHome , props: true },
  { path: "/admin/invoices", component: AdminInvoice , props: true },
  { path: "/admin/clients", component: AdminClients , props: true },


  //{ path: '/dashboard', component: Dashboard }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
