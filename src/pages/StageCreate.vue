<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h2 class="text-center">Aggiungi un attivita</h2>
      </div>
      <!-- name -->
      <div class="col-12 mb-2">
        <label for="title" class="form-label mb-0 ms-1">Nome attivita</label>
        <div class="input-google-icon">
          <label for="title" class="material-symbols-outlined icon">
            filter_retrolux
          </label>
          <input type="text" :class="['form-control', validate.check({ title, type: 'string', query: [3, 100] })]"
            id="title" v-model="title" placeholder="Scrivi il titolo">
        </div>
        <p :class="validate.showError('title')"> Il campo deve contenere un minimo di 3 caratteri e un
          massimo di 100. </p>
      </div>
      <!-- location -->
      <div class="col-12 mb-2">
        <label for="title" class="form-label mb-0 ms-1">Location</label>
        <div class="input-google-icon">
          <label for="title" class="material-symbols-outlined icon">
            explore
          </label>
          <input type="text" :class="['form-control', validate.check({ title, type: 'string', query: [3, 100] })]"
            id="title" v-model="title" placeholder="Scrivi il titolo">
        </div>
        <p :class="validate.showError('title')"> Il campo deve contenere un minimo di 3 caratteri e un
          massimo di 100. </p>
      </div>
      <!-- startTime -->
      <div class="col-6 mb-2">
        <label for="startTime" class="form-label mb-0 ms-1">Data inizio *</label>
        <input type="time" :class="['form-control', validate.check({ startTime, type: 'date' })]" id="startTime"
          v-model="startTime">
      </div>
      <!-- endTime -->
      <div class="col-6 mb-2">
        <label for="endTime" class="form-label mb-0 ms-1">Data fine *</label>
        <input type="time" :class="['form-control', validate.check({ endTime, type: 'end-date', query: startTime })]"
          id="endTime" v-model="endTime">
      </div>

      <div class="col-12">
        <p :class="validate.showError('endTime')"> Compila entrambe le date. La data di inizio deve essere antecedente
          alla data di fine. </p>
      </div>
      <!-- images -->
      <div class="col-12 mt-2">
        <div class="text-center">
          <CmpDropFile @getImg="store.firebase.uploadImg" fileType="img" />
        </div>

        <!-- Display uploaded images -->
        <div v-if="store.firebase.images" class="mt-3 text-center">
          <div v-for="(image, index) in store.firebase.images" :key="index"
            class="m-2 d-inline-block position-relative">
            <img :src="image" alt="Uploaded Image" class="d-inline-block" width="150" />
            <span type="button" @click="store.firebase.deleteImg(index)"
              class="position-absolute top-0 start-100 translate-middle btn btn-outline-danger p-0 rounded-circle d-flex justify-content-center align-items-center"
              style="width: 25px; aspect-ratio: 1/1;">
              x
              <span class="visually-hidden">Delete image</span>
            </span>
          </div>
        </div>
      </div>
      <!-- description -->
      <div class="col-12 mb-2">
        <label for="description" class="form-label mb-0 ms-1">Descrizione</label>
        <textarea class="form-control" id="description" rows="2" v-model="description"></textarea>
      </div>

      <!-- food -->
      <div class="col-12 mb-2">
        <label for="title" class="form-label mb-0 ms-1">food</label>
        <div class="input-google-icon">
          <label for="title" class="material-symbols-outlined icon">
            restaurant
          </label>
          <input type="text" :class="['form-control', validate.check({ title, type: 'string', query: [3, 100] })]"
            id="title" v-model="title" placeholder="Scrivi il titolo">
        </div>
        <p :class="validate.showError('title')"> Il campo deve contenere un minimo di 3 caratteri e un
          massimo di 100. </p>
      </div>
      <!-- curiosities -->
      <div class="col-12 mb-2">
        <label for="description" class="form-label mb-0 ms-1">curiosities</label>
        <textarea class="form-control" id="description" rows="2" v-model="description"></textarea>
      </div>
      <!-- rating -->
      <div class="col-12 mb-2">
        <label for="title" class="form-label mb-0 ms-1">rating</label>
        <div class="input-google-icon">
          <label for="title" class="material-symbols-outlined icon">
            star_rate
          </label>
          <input type="text" :class="['form-control', validate.check({ title, type: 'string', query: [3, 100] })]"
            id="title" v-model="title" placeholder="Scrivi il titolo">
        </div>
        <p :class="validate.showError('title')"> Il campo deve contenere un minimo di 3 caratteri e un
          massimo di 100. </p>
      </div>


      <div class="col-12">
        <button class="btn btn-outline-success w-100" @click="onSubmitTrip">ADD TRIP</button>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '../store.js'
import validate from '../personal_modules/validate.js';

import CmpDropFile from '../components/CmpDropFile.vue';

export default {
  components: { CmpDropFile },
  props: {
    id: {
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
      title: '',
      description: '',
      startTime: '',
      endTime: '',
    }
  },
  methods: {

    async onSubmitTrip() {
      if (this.validate.isAllValidated()) {
        const newTrip = await this.store.trip.add(this.sendObj(["title", "description", "startTime", "endTime"]))
        if (newTrip) {
          this.resetForm()
          this.$router.push({ name: 'home' });
        } else {
          alert('Errore onSubmitTrip contattare assistenza');
        }
      } else {
        alert('Per favore, completa tutti i campi correttamente.');
      }
    },

    sendObj(arrVarName) {
      const obj = {};
      arrVarName.forEach((name) => {
        if (this[name] !== undefined) {
          obj[name] = this[name];
        }
      });
      return obj
    },

    resetForm() {
      this.title = '';
      this.description = '';
      this.startTime = '';
      this.endTime = '';
      this.validate.init()
    }
  },
  created() {
    this.validate.init()
  }
}
</script>

<style lang="scss" scoped></style>