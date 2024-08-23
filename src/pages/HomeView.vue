<template>
  <div class="container">

    <div class="row">
      <div class="col position-relative">
        <img src="../assets/img/hero.png" class="w-100" alt="">
        <h4 class="text-end position-absolute bottom-0 end-0 fs-6 f-Codystar text-cream text-shadow">
          Esplora. Scopri. Vivi.<br>La tua avventura inizia qui.
          <span class="overlay"></span>
        </h4>
      </div>
    </div>

    <template v-if="store.userJWT">

      <div class="row">
        <div class="col-auto ms-auto">
          <span class="me-1">Inizia un nuovo viaggio</span>
          <RouterLink :to="{ name: 'trip.create' }">
            <button class="btn btn-outline-success p-1 rounded-circle border-0">
              <span class="material-symbols-outlined d-block">
                add_circle
              </span>
            </button>
          </RouterLink>

        </div>
      </div>

      <div v-if="store.trip.all" class="row row-cols-2 row-cols-md-3 row-cols-lg-4 mb-3">
        <RouterLink :to="{ name: 'trip.show', params: { id: key } }" class="col p-1"
          v-for="(trip, key) in store.trip.all" :key="key">
          <div class="card h-100 shadow">
            <img :src="store.tripTypes.getImgUrl(trip.tripType)" class="card-img-top" alt="cover travel">
            <div class="card-body  pb-0">
              <h5 class="card-title mb-0">{{ trip.title }}</h5>
              <p class="card-text mb-0 text-end"><small>{{ trip.startDate }} - {{ trip.endDate }}</small></p>
              <p class="card-text mb-0"><small class="text-body-secondary">Tap for details.</small></p>
            </div>
          </div>
        </RouterLink>
      </div>
    </template>

    <div class="row" v-else>
      <RouterLink to="/user"
        class="col-12 col-md-8 mx-auto border mt-3 text-center text-white bg-sky-blue rounded-btn h-opacity">
        <h2 class="f-Audiowide mt-2">ACCEDI <br> O <br> REGISTRATI ORA</h2>
      </RouterLink>
    </div>
  </div>
</template>

<script>
import { store } from '../store';
import CmpDropFile from '../components/CmpDropFile.vue';
export default {
  components: { CmpDropFile },
  data() {
    return {
      store,
    };
  },
  methods: {

  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
h4 {
  z-index: 1;
  padding: 8px;
  padding-top: 20px;
  padding-left: 20px;
  margin-bottom: 0px;
  margin-right: 12px;
}

.overlay {
  background: #083D77;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.75;
  border-radius: 70% 20% 0 10%;
}


.logo {
  display: inline-block;
  width: 100%;

  img {
    width: 100%;
    max-width: 100px;
  }
}
</style>
