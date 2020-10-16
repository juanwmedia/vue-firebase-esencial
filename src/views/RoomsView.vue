<template>
  <section class="section">
    <div class="container">
      <h1 class="title has-text-centered">
        Rooms
      </h1>

      <RoomsComponent :rooms="rooms" />
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import RoomsComponent from "../components/RoomsComponent.vue";
export default {
  name: "RoomsView",
  computed: {
    ...mapState("rooms", ["rooms"])
  },
  components: {
    RoomsComponent
  }
};
</script>
