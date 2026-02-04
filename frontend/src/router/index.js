import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AdminUsersView from '../views/AdminUsersView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/admin/users', name: 'admin-users', component: AdminUsersView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
