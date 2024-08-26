<template>
  <div class="container" v-if="stage">
    <div class="row">
      <div class="col-12 col-md-8 col-lg-6 mx-auto" v-if="Object.keys(stage.files).length">
        <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-indicators">
            <button v-for="(image, key, i) in stage.files" :key="key + '-btn'" type="button"
              data-bs-target="#carouselExampleCaptions" :data-bs-slide-to="i" :class="i === 0 ? 'active' : false"
              :aria-current="i === 0 ? 'true' : false" :aria-label="`Slide ${i + 1}`"></button>
          </div>

          <div class="carousel-inner">

            <div v-for="(image, key, i) in stage.files" :key="key + '-img'"
              :class="['carousel-item', i === 0 ? 'active' : 'false']">
              <img :src="image.url" class="d-block w-100" alt="img personale stage">
            </div>

          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div class="col-12" v-else>
        <h1>no images</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <h3>{{ stage.name }}</h3>
      </div>
      <div class="col-6 text-end">
        <p class="mb-0">{{ date }}</p>
        <p class="mb-0">{{ stage.startTime }} / {{ stage.endTime }}</p>
      </div>
      <div class="col-12">
        <p v-if="stage.description">description : {{ stage.description }}</p>
        <p v-if="stage.food">food : {{ stage.food }}</p>
        <p v-if="stage.curiosities">curiosities : {{ stage.curiosities }}</p>
        <p>rating :
          <span type="button" v-for="x in stage.rating" @click="updateRating(x)"
            class="material-symbols-outlined g-icon-fill fs-2 align-top text-warning">
            star_rate
          </span>
          <span type="button" v-for="x in (5 - stage.rating)" @click="updateRating(x + 5 - (5 - stage.rating))"
            class="material-symbols-outlined fs-2 align-top text-secondary">
            star_rate
          </span>
          
        </p>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div id="mapp" style="width: 100%; height: 50vw;"></div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 mt-3">
        <RouterLink :to="{ name: 'stage.update', params: { stageId, date } }" type="button"
          class="btn btn-outline-warning w-100 mb-1">
          Modifica attività
        </RouterLink>
      </div>
      <div class="col-12">
        <button class="btn btn-outline-danger w-100 " @click="deleteStage"> Elimina attività</button>
      </div>
    </div>
  </div>
</template>

<script>

import tt from '@tomtom-international/web-sdk-maps';
import { store } from '../store.js'
import validate from '../personal_modules/validate.js';
export default {
  props: {
    stageId: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      store,
      validate,
    }
  },
  methods: {
    async deleteStage() {
      const id = this.stage.trip_id
      await this.store.stage.delete(this.stageId)
      this.$router.push({ name: 'trip.show', params: { id } })
    },
    async updateRating(x) {
      this.store.loading.on();
      const newRateStage = Object.values(await this.store.stage.all[this.stageId].update({ rating: x }))[0].rating
      this.store.loading.off();
      this.store.stage.all[this.stageId].rating = newRateStage
    },
    initializeMap() {
      if (this.store.stage.all) {
        const position = { lng: this.stage.location.lng, lat: this.stage.location.lat }
        const map = tt.map({
          center: position,
          key: this.store.location.apikey,
          container: 'mapp',
          zoom: 13,
        });
        new tt.Marker().setLngLat(position).addTo(map);
      }
    }

  },
  computed: {
    stage() {
      if (this.store.trip.all && this.store.stage.all) {
        this.store.stage.all[this.stageId].rating = this.store.stage.all[this.stageId].rating ?? 0
        return this.store.stage.all[this.stageId]
      } else {
        return false
      }
    }
  },
  mounted() {

    if (document.getElementById('mapp')) {
      this.initializeMap()
    }
  },
  updated() {
    if (document.getElementById('mapp') && !document.getElementById('mapp').firstChild) {
      this.initializeMap()
    }
  }
}
</script>

<style lang="scss" scoped></style>