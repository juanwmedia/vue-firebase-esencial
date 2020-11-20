<template>
  <article class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <h1 class="title has-text-centered">Create Room</h1>

          <form @submit.prevent="createRoom">
            <div class="field">
              <label class="label">Name</label>
              <div class="control">
                <input
                  v-model="roomData.name"
                  class="input"
                  type="text"
                  placeholder="e.g. Black Cat mania 😼"
                  required
                />
              </div>
            </div>

            <div class="field">
              <label class="label">Description</label>
              <div class="control">
                <textarea
                  v-model="roomData.description"
                  class="textarea"
                  placeholder="e.g. Let's talk about why Black Cat's are fucking awesome"
                  required
                ></textarea>
              </div>
            </div>

            <div class="field">
              <label class="label">Image</label>
              <div class="control">
                <div
                  class="room__image"
                  :style="{
                    'background-image': `url(${roomImage})`
                  }"
                >
                  <a
                    href="#"
                    v-if="image"
                    @click.prevent="image = roomData.imageURL = null"
                    class="is-pulled-right button is-small is-danger is-outlined"
                    >X</a
                  >
                </div>
                <div class="file">
                  <label class="file-label">
                    <input
                      class="file-input"
                      type="file"
                      @change="onFileChange"
                      ref="file"
                    />
                    <span class="file-cta">
                      <span class="file-label">
                        Choose a image
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div class="field has-text-right">
              <div class="control">
                <button
                  type="submit"
                  class="button is-link"
                  :class="{ 'is-loading': isLoading }"
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: "CreateRoom",
  data() {
    return {
      isLoading: false,
      image: null,
      roomData: {
        name: "",
        description: "",
        imageURL: ""
      }
    };
  },
  methods: {
    onFileChange(event) {
      this.image = event.target.files[0];
      this.$refs.file.value = null;
    },

    async createRoom() {
      this.isLoading = true;
      try {
        const newRoom = await this.$store.dispatch("rooms/getNewRoomId");
        const roomID = newRoom.id;

        if (this.image) {
          this.imageURL = await this.$store.dispatch("rooms/uploadRoomImage", {
            roomID,
            file: this.image
          });
        }

        await this.$store.dispatch("rooms/createRoom", {
          name: this.roomData.name,
          description: this.roomData.description,
          image: this.imageURL,
          roomID
        });
        this.$toast.success("Room created");
        this.roomData.name = this.roomData.description = this.roomData.imageURL =
          "";
        setTimeout(() => this.$router.push({ name: "home" }), 1000);
      } catch (error) {
        console.error(error.message);
        this.$toast.error(error.message);
      } finally {
        this.isLoading = false;
      }
    }
  },
  computed: {
    roomImage() {
      return this.image
        ? URL.createObjectURL(this.image)
        : require("@/assets/img/room-image.jpg");
    }
  }
};
</script>

<style lang="scss" scoped>
.room__image {
  height: 20vmax;
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid;
  background-size: cover;
  background-position: center;
}
</style>
