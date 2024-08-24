<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h2 class="text-center">Modifica un attivita</h2>
      </div>
      <!-- name -->
      <div class="col-12 mb-2">
        <label for="name" class="form-label mb-0 ms-1">Nome attivita</label>
        <div class="input-google-icon">
          <label for="name" class="material-symbols-outlined icon">
            filter_retrolux
          </label>
          <input type="text" :class="['form-control', validate.check({ name, type: 'string', query: [3, 100] })]"
            id="name" v-model="name" placeholder="Scrivi il titolo">
        </div>
        <p :class="validate.showError('name')"> Il campo deve contenere un minimo di 3 caratteri e un
          massimo di 100. </p>
      </div>
      <!-- location -->
      <div class="col-12 mb-2">
        <label for="location" class="form-label mb-0 ms-1">Location</label>
        <div class="input-google-icon">
          <label for="location" class="material-symbols-outlined icon">
            explore
          </label>
          <input type="text" :class="['form-control', validate.check({ location, type: 'string', query: [3, 100] })]"
            id="location" v-model="location" placeholder="Scrivi il titolo">
        </div>
        <p :class="validate.showError('location')"> Il campo deve contenere un minimo di 3 caratteri e un
          massimo di 100. </p>
      </div>
      <!-- startTime -->
      <div class="col-6 mb-2">
        <label for="startTime" class="form-label mb-0 ms-1">Data inizio *</label>
        <input type="time" :class="['form-control', validate.check({ startTime, type: 'time' })]" id="startTime"
          v-model="startTime">
      </div>
      <!-- endTime -->
      <div class="col-6 mb-2">
        <label for="endTime" class="form-label mb-0 ms-1">Data fine *</label>
        <input type="time" :class="['form-control', validate.check({ endTime, type: 'time', query: startTime })]"
          id="endTime" v-model="endTime">
      </div>

      <!-- images -->
      <div class="col-12 mt-2">
        <div class="text-center">
          <CmpDropFile working="onUpload" @onUpload="getFileList" id="cpm-upload-files" fileType="img" multiple />
        </div>

        <!-- Display uploaded images -->
        <div class="mt-3 text-center">
          <template v-if="imgFiles.length">
            <div v-for="(image, index) in imgFiles" :key="index" class="m-2 d-inline-block position-relative">
              <img :src="image.url" alt="Uploaded Image" class="d-inline-block" width="150" />
              <span type="button" @click="imgFiles.splice(index, 1)"
                class="position-absolute top-0 start-100 translate-middle btn btn-outline-danger p-0 rounded-circle d-flex justify-content-center align-items-center"
                style="width: 25px; aspect-ratio: 1/1;">
                x
                <span class="visually-hidden">Delete image</span>
              </span>
            </div>
          </template>
          <template v-if="newImgFiles.length">
            <div v-for="(image, index) in newImgFiles" :key="index" class="m-2 d-inline-block position-relative">
              <img :src="image.url" alt="Uploaded Image" class="d-inline-block" width="150" />
              <span type="button" @click="newImgFiles.splice(index, 1)"
                class="position-absolute top-0 start-100 translate-middle btn btn-outline-danger p-0 rounded-circle d-flex justify-content-center align-items-center"
                style="width: 25px; aspect-ratio: 1/1;">
                x
                <span class="visually-hidden">Delete image</span>
              </span>
            </div>
          </template>
        </div>

      </div>
      <!-- description -->
      <div class="col-12 mb-2">
        <label for="description" class="form-label mb-0 ms-1">Descrizione</label>
        <textarea class="form-control" id="description" rows="2" v-model="description"></textarea>
      </div>

      <!-- food -->
      <div class="col-12 mb-2">
        <label for="food" class="form-label mb-0 ms-1">food</label>
        <div class="input-google-icon">
          <label for="food" class="material-symbols-outlined icon">
            restaurant
          </label>
          <input type="text" :class="['form-control']" id="food" v-model="food"
            placeholder="Scrivi cosa vorresti mangire">
        </div>
        <p :class="validate.showError('food')"> Il campo deve contenere un minimo di 3 caratteri e un
          massimo di 100. </p>
      </div>
      <!-- curiosities -->
      <div class="col-12 mb-2">
        <label for="curiosities" class="form-label mb-0 ms-1">curiosities</label>
        <textarea class="form-control" id="curiosities" rows="2" v-model="curiosities"></textarea>
      </div>

      <div class="col-12">
        <button class="btn btn-outline-success w-100" @click="onSubmitTrip">Modifica attività</button>
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
      name: ' ',
      location: '',
      startTime: '',
      endTime: '',
      description: '',
      food: '',
      curiosities: '',
      imgFiles: [],
      newImgFiles: [],
    }
  },
  methods: {

    async onSubmitTrip() {
      if (this.validate.isAllValidated()) {
        this.store.loading.on();
        let outer = this.sendObj([
          "name",
          "location",
          "startTime",
          "endTime",
          "description",
          "food",
          "curiosities"
        ])
        outer.location = {
          address: outer.location,
          lat: 33065114516071,
          lon: 41528345635181,
        }
        for (const key in this.stage.files) {
          if (!this.imgFiles.includes(this.stage.files[key])) {
            await this.stage.deleteFile(key)
          }
        }

        if (this.newImgFiles.length) {
          await this.stage.uploadFiles(this.newImgFiles);
        }
        const stageUpdated = await this.store.stage.all[this.stageId].update(outer)
        this.store.stage.all[this.stageId] = Object.values(stageUpdated)[0];

        this.resetForm();
        const id = this.stage.trip_id
        this.store.loading.off();
        this.$router.push({ name: 'trip.show', params: { id } });
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
      this.name = '';
      this.location = '';
      this.startTime = '';
      this.endTime = '';
      this.imgFiles = [];
      this.newImgFiles = [];
      this.description = '';
      this.food = '';
      this.curiosities = '';
      this.validate.init()
    },

    getFileList(files) {
      for (const file of files) {
        this.newImgFiles.push(file)
      }
    }
  },
  computed: {
    stage() {
      if (this.store.trip.all && this.store.stage.all) {
        return this.store.stage.all[this.stageId]
      } else {
        return false
      }
    }
  },
  watch: {
    'stage'(newstage, oldstage) {
      if (newstage !== oldstage && oldstage === false) {
        if (newstage) {
          this.name = this.stage.name;
          this.location = this.stage.location.address;
          this.startTime = this.stage.startTime;
          this.endTime = this.stage.endTime;
          this.imgFiles = Object.values(this.stage.files);
          this.newImgFiles = [];
          this.description = this.stage.description;
          this.food = this.stage.food;
          this.curiosities = this.stage.curiosities;
          this.validate.init()
        }
      }
    }
  },
  created() {
    if (this.stage) {
      this.name = this.stage.name;
      this.location = this.stage.location.address;
      this.startTime = this.stage.startTime;
      this.endTime = this.stage.endTime;
      this.imgFiles = Object.values(this.stage.files);
      this.newImgFiles = [];
      this.description = this.stage.description;
      this.food = this.stage.food;
      this.curiosities = this.stage.curiosities;
      this.validate.init()
    }
  }
}
</script>

<style lang="scss" scoped></style>