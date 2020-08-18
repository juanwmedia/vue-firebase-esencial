<template>
  <div class="container">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item">
          <img class="navbar__logo" src="../assets/img/VueTalk-logo.png" />
        </a>
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
          <router-link class="navbar-item" to="/">
            Home
          </router-link>

          <router-link class="navbar-item" to="/">
            Create Room
          </router-link>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <router-link class="button is-primary" to="/">
                <strong>Profile</strong>
              </router-link>
              <a @click="doLogout" class="button is-light">
                Log out
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
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
    doLogout() {}
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
