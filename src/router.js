import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './pages/HomeView.vue'
import ContactView from './pages/ContactView.vue'
import UserView from './pages/UserView.vue'
import TripCreate from './pages/TripCreate.vue'
import TripShow from './pages/TripShow.vue'
import StageCreate from './pages/StageCreate.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/user', name: 'user', component: UserView },
    { path: '/contact', name: 'contact', component: ContactView },

    // trip
    { path: '/trip-new', name: 'trip.create', component: TripCreate },
    { path: '/trip/:id', name: 'trip.show', component: TripShow, props: true },
    { path: '/trip/:id/:date/', name: 'stage.create', component: StageCreate, props: true },
  ],
})