<template>
  <CmpLoading v-if="store.loading.state || user.accessToken === null" />

  <template v-if="user.accessToken !== null">
    <AppHeader />

    <main class="d-flex">
      <RouterView />
    </main>

    <AppFooter />
  </template>
  <p v-else>.</p>
</template>

<script>
import { store } from './store.js';
import { user } from './user.js';
import { routes } from './router.js';
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import CmpLoading from './components/CmpLoading.vue'
export default {
  components: { AppHeader, AppFooter, CmpLoading },
  data() {
    return {
      store,
      user,
      routes,
    }
  },
  watch: {
    // Watcher necessari per far funzionare il redirect.
    'user.accessToken'(newLog, oldLog) {
      if (newLog !== oldLog) {
        this.store.userJWT = newLog

        if (newLog) {
          this.store.onLogin()
        } else {
          this.store.onLogout()
        }
        this.checkRoute()
      }
    },
    '$route.name'(newRoute, oldRoute) {
      if (newRoute && newRoute !== oldRoute && user.accessToken !== null) {
        this.checkRoute()
      }
    },
  },
  methods: {
    // Controlla i nomi delle rotte importati da './router.js'
    checkRoute() {
      // se this.store.userJWT non é null o false l'utente é loggato
      // dunque se loggato this.store.userJWT sará considerato true
      if (this.store.userJWT) {
        if (this.routes.notAuth.includes(this.$route.name)) {
          this.$router.push({ name: 'home' });
        }
      } else {
        if (this.routes.auth.includes(this.$route.name)) {
          this.$router.push({ name: 'home' });
        }
      }
    }
  },
  async mounted() {
    await this.store.start()
    this.user.checkLogged()
  },
}
</script>

<style lang="scss">
/*
@use '../assets/scss/partials/_variables.scss' as *;
*/
</style>