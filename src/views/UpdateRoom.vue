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
                    v-if="imageURL"
                    @click.prevent="image = imageURL = null"
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
                <button
                  @click="removeRoom"
                  type="button"
                  class="button is-danger"
                >
                  Delete
                </button>
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
      this.room = await this.$store.dispatch("rooms/getRoom", this.id);
      this.imageURL = this.room.image;
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
      isLoading: false,
      image: null,
      imageURL: null
    };
  },
  methods: {
    onFileChange(event) {
      this.image = event.target.files[0];
      this.imageURL = URL.createObjectURL(this.image);
      this.$refs.file.value = null;
    },

    async updateRoom() {
      this.isLoading = true;
      try {
        if (this.image) {
          this.imageURL = await this.$store.dispatch("rooms/uploadRoomImage", {
            roomID: this.id,
            file: this.image
          });
        }

        await this.$store.dispatch("rooms/updateRoom", {
          roomID: this.id,
          name: this.room.name,
          description: this.room.description,
          image: this.imageURL
        });
        this.$toast.success("Room data updated");
      } catch (error) {
        console.error(error.message);
        this.$toast.error(error.message);
      } finally {
        this.isLoading = false;
      }
    },

    async removeRoom() {
      try {
        await this.$store.dispatch("utils/requestConfirmation", {
          props: { message: "¿Remove room?" },
          component: "ConfirmationModal"
        });

        await this.$store.dispatch("rooms/removeRoom", this.id);
        this.$toast.success("Room removed");
        this.$router.push({ name: "home" });
      } catch (error) {
        console.error(error.message);
        this.$toast.error(error.message);
      }
    }
  },
  computed: {
    hasDataChanged() {
      return this.room.name && this.room.description;
    },
    roomImage() {
      return this.imageURL
        ? this.imageURL
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
