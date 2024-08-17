<template>
  <div class="container" v-if="trip">
    <div class="row">
      <div class="col-12">
        <h1 class="text-center">{{ store.trip.types[trip.tripType].title_EN }}</h1>
      </div>
      <div class="col-12 position-relative overflow-hidden p-0">
        <img :src="store.firebase.getImgUrl(store.trip.types[trip.tripType].url_img)" class="w-100"
          alt="copertina tipo viaggio">
        <div class="position-absolute top-0 start-0 w-100 h-100 overlay-animation">
          <img :src="overlay[Math.floor(Math.random() * 6)]" class="w-100 opacity-75" alt="">
          <h4
            class="position-absolute top-50 start-0 translate-middle-y ms-2 mt-2 mb-0 f-PermanentMarker text-orange-l text-shadow"
            style="width: 40%;">
            {{ store.trip.types[trip.tripType].description_IT }}
          </h4>
        </div>
      </div>
      <div class="col-12 mb-3">
        <h2 class="">{{ trip.title }}</h2>
        <p>{{ trip.description }}</p>
      </div>
    </div>
    <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4">
      <!-- <RouterLink :to="{ name: 'stage.create', params: { id, date: key } }" class="col p-2" -->
      <div class="col p-2" v-for="(day, key) in trip.day" :key="key">
        <div class="border rounded p-2 pt-3 position-relative">
          <span class="position-absolute top-0 start-0 translate-middle-y badge rounded bg-light text-orange-l">
            {{ key }}
          </span>
          <span class="position-absolute top-0 end-0 translate-middle-y">
            <RouterLink :to="{ name: 'stage.create', params: { id, date: key } }" type="button"
              class="btn btn-outline-success p-1 rounded-circle border-0">
              <span class="material-symbols-outlined d-block">
                add_circle
              </span>
            </RouterLink>
          </span>
          <template v-if="Object.keys(day).length > 0">
            <p v-for="(stage, stageid) in day" :key="stageid" class="mb-0">
              <RouterLink :to="{ name: 'stage.show', params: { id, date: key, stageid } }">
                {{ stage.name }}
              </RouterLink>
            </p>
          </template>
          <p v-else class="mb-0">Ancora nessuna attivita per {{ key }}</p>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '../store.js'
import validate from '../personal_modules/validate.js';
import overlay_1 from '../assets/img/overlay/overlay_1.svg';
import overlay_2 from '../assets/img/overlay/overlay_2.svg';
import overlay_3 from '../assets/img/overlay/overlay_3.svg';
import overlay_4 from '../assets/img/overlay/overlay_4.svg';
import overlay_5 from '../assets/img/overlay/overlay_5.svg';
import overlay_6 from '../assets/img/overlay/overlay_6.svg';
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      store,
      validate,
      overlay: [overlay_1, overlay_2, overlay_3, overlay_4, overlay_5, overlay_6]
    }
  },
  methods: {

  },
  computed: {
    trip() {
      if (this.store.trip.all) {
        return this.store.trip.all[this.id]
      } else {
        return false
      }
    }
  },
  created() {
    this.validate.init()
  }
}
</script>

<style lang="scss" scoped>
.overlay-animation {
  -webkit-animation-name: come_left;
  -webkit-animation-duration: 2s;
  animation-name: come_left;
  animation-duration: 2s;
}

@-webkit-keyframes come_left {
  from {
    opacity: 0.3;
    transform: translate(-50vw, 0px);
  }

  to {
    opacity: 1;
    transform: translate(0, 0);
  }
}
</style>