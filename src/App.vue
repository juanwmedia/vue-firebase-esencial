<template>
  <div id="app">
    <NavBarComponent />
    <router-view />
  </div>
</template>

<script>
import NavBarComponent from "./components/NavBarComponent";

export default {
  name: "App",
  components: {
    NavBarComponent
  }
};
</script>

<style lang="scss"></style>
