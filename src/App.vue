<template>
  <div id="app">
    <NavBarComponent />
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
