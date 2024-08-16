<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h2 class="text-center">Aggiungi un viaggio</h2>
      </div>
      <template v-if="store.trip.types">
        <div class="col-12">
          <h5>Seleziona un tipo di viaggio</h5>
          <div class="carousel slide">
            <div class="carousel-indicators">
              <button v-for="(_type, key, index) in store.trip.types" :key="fillTripTypeIndex(index, key) + 'tbtn'"
                type="button" data-bs-target="" @click="nextTypeTrip(key)"
                :class="index === tripTypeIndex[tripType] ? 'active' : ''"></button>
            </div>
            <div class="carousel-inner">

              <div v-for="(_type, key, index) in store.trip.types" :key="key + 'timg'"
                :class="['carousel-item', index === tripTypeIndex[tripType] ? 'active' : '']">
                <img :src="store.firebase.getImgUrl(_type.url_img)" class="d-block w-100"
                  :alt="'trip ' + _type.title_IT">
                <div class="carousel-caption d-block">
                  <h5>{{ _type.title_EN }}</h5>
                  <p class="carousel-caption d-none d-md-block">{{ _type.description_IT }}</p>
                </div>
              </div>

            </div>
            <button class="carousel-control-prev" type="button" @click="prevTypeTrip()">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" @click="nextTypeTrip()">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>

        </div>
        <div class="col-12 mt-1 mb-2">
          <select class="form-select" v-model="tripType">
            <option v-for="(_type, key, index) in store.trip.types" :key="key + 'timg'" :value="key">
              {{ _type.title_EN }}
              <small>({{ _type.title_IT }})</small>
            </option>
          </select>
        </div>
      </template>
      <div class="col-12 mb-2">
        <label for="title" class="form-label mb-0 ms-1">Titolo viaggio *</label>
        <div class="input-google-icon">
          <label for="title" class="material-symbols-outlined icon">
            luggage
          </label>
          <input type="text" :class="['form-control', validate.check({ title, type: 'string', query: [3, 100] })]"
            id="title" v-model="title" placeholder="Scrivi il titolo">
        </div>
        <p :class="validate.showError('title')"> Il campo deve contenere un minimo di 3 caratteri e un
          massimo di 100. </p>
      </div>

      <div class="col-12 mb-2">
        <label for="description" class="form-label mb-0 ms-1">Descrizione</label>
        <textarea class="form-control" id="description" rows="3" v-model="description"></textarea>
      </div>

      <div class="col-6 mb-2">
        <label for="startDate" class="form-label mb-0 ms-1">Data inizio *</label>
        <input type="date" :class="['form-control', validate.check({ startDate, type: 'date' })]" id="startDate"
          v-model="startDate">
      </div>

      <div class="col-6 mb-2">
        <label for="endDate" class="form-label mb-0 ms-1">Data fine *</label>
        <input type="date" :class="['form-control', validate.check({ endDate, type: 'end-date', query: startDate })]"
          id="endDate" v-model="endDate">
      </div>

      <div class="col-12">
        <p :class="validate.showError('endDate')"> Compila entrambe le date. La data di inizio deve essere antecedente
          alla data di fine. </p>
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
export default {
  data() {
    return {
      store,
      validate,
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      tripType: '',
      tripTypeIndex: null
    }
  },
  methods: {
    fillTripTypeIndex(index, key) {
      if (this.tripTypeIndex === null) {
        this.tripTypeIndex = {}
        this.tripTypeIndex[key] = index
        if (index === 0) {
          this.tripType = key
        }
      } else {
        this.tripTypeIndex[key] = index
      }
      return key
    },
    nextTypeTrip(key = null) {
      if (key !== null) {
        this.tripType = key
      } else {
        const nextIndex = this.tripTypeIndex[this.tripType] + 1;
        let firstKey;
        const nextType = Object.entries(this.tripTypeIndex).find(([_key, i]) => {
          if (!firstKey) { firstKey = _key }
          return i === nextIndex
        });
        this.tripType = nextType ? nextType[0] : firstKey;
      }
    },
    prevTypeTrip() {

      const nextIndex = this.tripTypeIndex[this.tripType] - 1;
      let lastKey;
      const nextType = Object.entries(this.tripTypeIndex).find(([_key, i]) => {
        lastKey = _key
        return i === nextIndex
      });
      this.tripType = nextType ? nextType[0] : lastKey;
    },

    async onSubmitTrip() {
      if (this.validate.isAllValidated()) {
        const newTrip = await this.store.trip.add(this.sendObj(["title", "description", "startDate", "endDate", "tripType"]))
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
      this.startDate = '';
      this.endDate = '';
      this.tripType = Object.entries(this.tripTypeIndex)[0][0];
      this.validate.init()
    }
  },
  created() {
    this.validate.init()
  }
}
</script>

<style lang="scss" scoped></style>