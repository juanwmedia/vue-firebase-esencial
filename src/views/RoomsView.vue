<template>
  <section class="section">
    <div class="container">
      <h1 class="title has-text-centered">
        Rooms
      </h1>

      <form>
        <input type="file" @change="doUpload" />
      </form>

      <RoomsComponent
        :unread-messages="unreadMessages"
        :rooms="$store.getters['rooms/roomsByDate']"
      />
    </div>
  </section>
</template>

<script>
import { storage } from "../firebase.js";
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
  methods: {
    doUpload(event) {
      // Obtener el archivo
      const file = event.target.files[0];

      // Crear una referencia en Cloud Storage
      const ref = storage.ref("images/" + file.name);

      // Subir el archivo
      const upload = ref.put(file);

      // Supervisar el proceso
      upload.on(
        "state_changed",
        function progress(snapshot) {
          console.warn((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        function error(error) {
          console.error(error);
        },
        function complete() {
          console.info("Finished uploading!!!");
        }
      );
    }
  },
  components: {
    RoomsComponent
  }
};
</script>
