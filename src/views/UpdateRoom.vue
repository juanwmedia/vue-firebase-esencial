<template>
  <article class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <h1 class="title has-text-centered">Edit Room</h1>
          <!-- Room form -->
          <form v-if="room" @submit.prevent="updateRoom">
            <div class="field">
              <label class="label">Name</label>
              <div class="control">
                <input
                  :placeholder="room.name"
                  v-model="room.name"
                  class="input"
                  type="text"
                />
              </div>
            </div>

            <div class="field">
              <label class="label">Description</label>
              <div class="control">
                <textarea
                  :placeholder="room.description"
                  v-model="room.description"
                  class="textarea"
                ></textarea>
              </div>
            </div>

            <div class="field is-grouped is-grouped-right">
              <div class="control">
                <button
                  type="submit"
                  class="button is-link"
                  :disabled="!hasDataChanged"
                  :class="{ 'is-loading': isLoading }"
                >
                  Update
                </button>
              </div>
              <div class="control">
                <button class="button is-danger">Delete</button>
              </div>
            </div>
          </form>
          <!-- End of room form -->
        </div>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: "UpdateRoom",
  async created() {
    try {
      // Grab from local state
      let room = this.$store.getters["rooms/getRoom"](this.id);
      if (!room) {
        // Grab from Cloud Firestore 🔥
        room = await this.$store.dispatch("rooms/getRoom", this.id);
        if (!room.exists) throw new Error("Could not find room");
        room = room.data();
      }
      this.room = room;
    } catch (error) {
      console.error(error.message);
      this.$toast.error(error.message);
      this.$router.push({ name: "home" });
    }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      room: null,
      isLoading: false
    };
  },
  methods: {
    async updateRoom() {
      this.isLoading = true;
      try {
        await this.$store.dispatch("rooms/updateRoom", {
          roomID: this.id,
          name: this.room.name,
          description: this.room.description
        });
        this.$toast.success("Room data updated");
      } catch (error) {
        console.erro(error.message);
        this.$toast.error(error.message);
      } finally {
        this.isLoading = false;
      }
    }
  },
  computed: {
    hasDataChanged() {
      return this.room.name && this.room.description;
    }
  }
};
</script>
