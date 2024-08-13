<template>
  <div class="container my-auto">
    <div class="row">

      <div class="col-12 col-md-8 mx-auto">
        <!-- Image upload section -->
        <div v-if="store.user.isLogged" class="border border-light rounded position-relative py-2 px-4 mt-2">
          <span class="position-absolute top-0 start-0 translate-middle">
            <img src="../assets/img/box.svg" alt="icona di un box di legno">
          </span>

          <div class="mb-3 text-center">
            <CmpDropFile @getImg="store.firebase.uploadImg" fileType="img" />
          </div>

          <!-- Display uploaded images -->
          <div v-if="store.firebase.images" class="mb-3 text-center">
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
  created() {
  }
}
</script>

<style lang="scss" scoped>
.logo {
  display: inline-block;
  width: 100%;

  img {
    width: 100%;
    max-width: 100px;
  }
}
</style>
