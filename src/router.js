import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './pages/HomeView.vue'
import ContactView from './pages/ContactView.vue'
import UserView from './pages/UserView.vue'
import TripCreate from './pages/TripCreate.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/user', name: 'user', component: UserView },
    { path: '/contact', name: 'contact', component: ContactView },

    // trip
    { path: '/trip-new', name: 'trip.create', component: TripCreate },

    // { path: '/esempio/:slug', name: 'esempio.show', component: EsempioShow, props: true },
  ],
})