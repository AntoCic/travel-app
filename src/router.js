import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './pages/HomeView.vue'
import ContactView from './pages/ContactView.vue'
import UserView from './pages/UserView.vue'
import TripCreate from './pages/TripCreate.vue'
import TripShow from './pages/TripShow.vue'
import StageCreate from './pages/StageCreate.vue'
import StageShow from './pages/StageShow.vue'
import TripUpdate from './pages/TripUpdate.vue'
import StageUpdate from './pages/StageUpdate.vue'

// Definizione delle rotte complete
const fullRoutes = {
  public: [ // Aggiungi le rotte publiche qui, visibili sia da autenticacto che da non autenticato.

    { path: '/', name: 'home', component: HomeView },
    { path: '/contact', name: 'contact', component: ContactView },

  ],
  notAuth: [ // Aggiungi le rotte visibili solo se non sei autenticato qui, se necessario.

    { path: '/user', name: 'user', component: UserView },

  ],
  auth: [ // Aggiungi le rotte visibili solo se autenticato qui, se necessario.

    // trip
    { path: '/trip-new', name: 'trip.create', component: TripCreate },
    { path: '/trip/:id', name: 'trip.show', component: TripShow, props: true },
    { path: '/trip/update/:id', name: 'trip.update', component: TripUpdate, props: true },
    { path: '/stage/:tripId/:date', name: 'stage.create', component: StageCreate, props: true },
    { path: '/stage/:stageId/:date/', name: 'stage.show', component: StageShow, props: true },
    { path: '/stage/update/:stageId/:date/', name: 'stage.update', component: StageUpdate, props: true },

  ],
};





// funzione interna che crea l'Object routes che contiene gli array con i 
// nomi delle rotte pe gestire i ridirect
const routes = Object.keys(fullRoutes).reduce((acc, key) => {
  acc[key] = fullRoutes[key].map(route => route.name);
  return acc;
}, {});

const routerRoutes = [...fullRoutes.public, ...fullRoutes.notAuth, ...fullRoutes.auth];
const router = createRouter({ history: createWebHistory(), routes: routerRoutes })

export { router, routes };
