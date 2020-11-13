<template>
  <section class="section">
    <div class="container">
      <h1 class="title has-text-centered">
        Rooms
      </h1>

      <RoomsComponent
        :unread-messages="unreadMessages"
        :rooms="$store.getters['rooms/roomsByDate']"
      />
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import RoomsComponent from "../components/RoomsComponent.vue";
export default {
  name: "RoomsView",
  computed: {
    ...mapState("rooms", ["rooms"]),
    ...mapState("messages", ["messages"]),
    ...mapState("user", ["meta"]),
    unreadMessages() {
      return this.messages.filter(message => {
        return (
          // User participated
          this.meta.joined[message.roomId] &&
          // Message sent after user last connection
          this.meta.joined[message.roomId] < message.createdAt
        );
      });
    }
  },
  components: {
    RoomsComponent
  }
};
</script>
