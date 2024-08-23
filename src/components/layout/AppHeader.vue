<template>
  <header>
    <div class="container text-blu">
      <nav class="row align-items-center my-1">
        <div class="col">
          <RouterLink to="/" class="logo">
            <img src="/img/logo.png" alt="Vue logo" />
            <h1 class="d-inline-block align-text-top mb-0 f-Audiowide simple">TripCicRem</h1>
          </RouterLink>
        </div>

        <div class="col-auto">
          <button v-if="user.accessToken" @click="user.logout" class="btn btn-outline-danger border-0 px-1 me-1 mt-3">
            <span v-if="user.userName" class="me-1">{{ user.userName }}</span>
            <span class="material-symbols-outlined align-top">
              logout
            </span>
          </button>

          <RouterLink to="/user" v-else>
            <span type="button" class="material-symbols-outlined h-ivert me-2 mt-3">
              account_circle
            </span>
          </RouterLink>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import { user } from '../../user.js';
export default {
  data() {
    return {
      user,
    }
  },
  mounted() {
  }
}

</script>


<style lang="scss" scoped>
@use '../../assets/scss/partials/_variables.scss' as *;

.logo {
  img {
    height: 6em;
    will-change: filter;
    transition: filter 300ms;
  }

  &:hover img {
    filter: drop-shadow(0 0 2em $yellow);
  }
}

.simple {
  text-shadow: $yellow 1px 1px 0;
}
</style>