<template>
  <div class="container" v-if="stage">
    <div class="row">
      <div class="col-12" v-if="stage.images">
        <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-indicators">
            <button v-for="(imgName, key, i) in stage.images" :key="key + '-btn'" type="button"
              data-bs-target="#carouselExampleCaptions" :data-bs-slide-to="i" :class="i === 0 ? 'active' : false"
              :aria-current="i === 0 ? 'true' : false" :aria-label="`Slide ${i + 1}`"></button>
          </div>

          <div class="carousel-inner">

            <div v-for="(imgName, key, i) in stage.images" :key="key + '-img'"
              :class="['carousel-item', i === 0 ? 'active' : 'false']">
              <img :src="imgName" class="d-block w-100" alt="img personale stage">
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
      <div class="col-6">
        <h3>{{ stage.name }}</h3>
      </div>
      <div class="col-6 text-end">
        <p class="mb-0">{{ date }}</p>
        <p class="mb-0">{{ stage.startTime }} / {{ stage.endTime }}</p>
      </div>
      <div class="col-12">
        <p>description : {{ stage.description }}</p>
        <p>food : {{ stage.food }}</p>
        <p>curiosities : {{ stage.curiosities }}</p>
        <p>rating : {{ stage.rating ?? 0 }}</p>

      </div>
    </div>
  </div>
</template>

<script>
import { store } from '../store.js'
import validate from '../personal_modules/validate.js';
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    stageid: {
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


  },
  computed: {
    stage() {
      if (this.store.trip.all && this.store.trip.all[this.id]) {
        return this.store.trip.all[this.id].day[this.date][this.stageid]
      } else {
        return false
      }
    }
  },
  created() {
    // this.validate.init()
  }
}
</script>

<style lang="scss" scoped>

</style>