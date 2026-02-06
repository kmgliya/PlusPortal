import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import AdminUsersView from '../views/AdminUsersView.vue'
import LoginView from '../views/LoginView.vue'
import AdminHomeView from '../views/AdminHomeView.vue'
import HomeView from '../views/HomeView.vue'
import CoursesView from '../views/CoursesView.vue'
import ReportsView from '../views/ReportsView.vue'
import RegulationsView from '../views/RegulationsView.vue'
import ScheduleView from '../views/ScheduleView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginView },
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: 'home', name: 'home', component: HomeView },
      { path: 'courses', name: 'courses', component: CoursesView },
      { path: 'reports', name: 'reports', component: ReportsView },
      { path: 'regulations', name: 'regulations', component: RegulationsView },
      { path: 'schedule', name: 'schedule', component: ScheduleView },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: 'home', name: 'admin-home', component: AdminHomeView },
      { path: 'courses', name: 'admin-courses', component: CoursesView },
      { path: 'reports', name: 'admin-reports', component: ReportsView },
      { path: 'regulations', name: 'admin-regulations', component: RegulationsView },
      { path: 'schedule', name: 'admin-schedule', component: ScheduleView },
      { path: 'users', name: 'admin-users', component: AdminUsersView },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  if (to.name === 'login') {
    return true
  }

  const token = localStorage.getItem('pp_token')
  if (!token) {
    return { name: 'login' }
  }

  const user = localStorage.getItem('pp_current_user')
  const role = user ? JSON.parse(user).role : 'employee'

  if (role === 'admin') {
    return to.path.startsWith('/admin') ? true : { name: 'admin-home' }
  }

  return to.path.startsWith('/admin') ? { name: 'home' } : true
})

export default router
