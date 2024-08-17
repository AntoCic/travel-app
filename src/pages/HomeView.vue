<template>
  <div class="container">

    <div class="row">
      <div class="col position-relative">
        <img src="../assets/img/hero.png" class="w-100" alt="">
        <h4 class="text-end position-absolute bottom-0 end-0 fs-6 codystar-regular text-cream text-shadow">
          Esplora. Scopri. Vivi.<br>La tua avventura inizia qui.
          <span class="overlay"></span>
        </h4>
      </div>
    </div>

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
      <RouterLink :to="{ name: 'trip.show', params: { id: key } }" class="col p-1" v-for="(trip, key) in store.trip.all"
        :key="key">
        <div class="card h-100 shadow">
          <img :src="store.firebase.getImgUrl(store.trip.types[trip.tripType].url_img)" class="card-img-top"
            alt="cover travel">
          <div class="card-body  pb-0">
            <h5 class="card-title mb-0">{{ trip.title }}</h5>
            <p class="card-text mb-0 text-end"><small>{{ trip.startDate }} - {{ trip.endDate }}</small></p>
            <p class="card-text mb-0"><small class="text-body-secondary">Tap for details.</small></p>
          </div>
        </div>
      </RouterLink>
    </div>

    <div class="row">

      <div class="col-12 col-md-8 mx-auto">
        <!-- Image upload section -->
        <div v-if="store.user.isLogged" class="border border-light rounded position-relative py-2 px-4 mt-2">
          <span class="position-absolute top-0 start-0 translate-middle">
            <img src="../assets/img/box.svg" alt="icona di un box di legno">
          </span>



          <!-- Existing items section -->
          <div class="input-group mb-3">
            <input type="text" class="form-control" v-model="newItem" placeholder="items to add">
            <button class="btn btn-outline-success" type="button" @click="addItems">
              <span class="material-symbols-outlined">add</span>
            </button>
          </div>

          <div class="input-group mb-1" v-for="(item, key) in store.firebase.items" :key="key">
            <input type="text" class="form-control" v-model="item.name" placeholder="items to add">
            <button class="btn btn-outline-warning" type="button" @click="store.firebase.db_update(key, item.name)">
              <span class="material-symbols-outlined">edit</span>
            </button>
            <button class="btn btn-outline-danger" type="button" @click="store.firebase.db_delete(key)">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
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
      newItem: '',
    };
  },
  methods: {
    async addItems() {
      const isAdded = await this.store.firebase.db_add(this.newItem);
      if (isAdded) {
        this.newItem = '';
      } else {
        console.log('Error adding item');
      }
    },

  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.codystar-regular {
  font-family: "Codystar", sans-serif;
  font-weight: 500;
  font-style: normal;
}

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
