<template>
  <div class="container">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link :to="{ name: 'home' }" class="navbar-item">
          <img class="navbar__logo" src="../assets/img/VueTalk-logo.png" />
        </router-link>
        <a
          @click.prevent="toggleNavBar"
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navBar"
          ref="burger"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navBar" class="navbar-menu" ref="navBar">
        <div class="navbar-start">
          <router-link class="navbar-item" :to="{ name: 'home' }">
            Home
          </router-link>

          <router-link class="navbar-item" :to="{ name: 'create' }">
            Create Room
          </router-link>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <template v-if="user">
                <router-link
                  class="button is-primary"
                  :to="{ name: 'profile' }"
                >
                  <strong>Profile</strong>
                </router-link>
                <a @click="doLogout" class="button is-light">
                  Log out
                </a>
              </template>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "NavBarComponent",
  mounted() {
    this.burger = this.$refs.burger;
    this.navBar = this.$refs.navBar;
  },
  data() {
    return {
      burger: null,
      navBar: null
    };
  },
  methods: {
    toggleNavBar() {
      this.burger.classList.toggle("is-active");
      this.navBar.classList.toggle("is-active");
    },
    async doLogout() {
      try {
        await this.$store.dispatch("user/doLogout");
        this.$router.push({ name: "auth" });
        this.$toast.success("Logged out");
      } catch (error) {
        this.$toast.error(error.message);
        console.error(error.message);
      }
    }
  },
  computed: {
    ...mapState("user", ["user"])
  }
};
</script>

<style lang="scss" scoped>
.navbar-item img {
  max-height: none;
}
.navbar__logo {
  width: 200px;
  height: auto;
}
</style>
