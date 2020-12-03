<template>
  <section class="send">
    <form @submit.prevent="createMessage" class="form">
      <div class="control">
        <textarea
          v-model="message"
          class="textarea form__textarea"
          placeholder="Write your message here..."
        ></textarea>
      </div>
      <div
        v-if="photo"
        @click="photo = null"
        class="photo-preview"
        :style="{ 'background-image': `url(${messagePhoto})` }"
      ></div>
      <div v-if="audio" class="audio-preview">
        <a href="#" @click="audio = null" class="close">X</a>
        <audio :src="messageAudio" controls></audio>
      </div>
      <div class="control">
        <button
          @click="recordAudio"
          :disabled="isLoading"
          type="button"
          class="button"
          :class="{ 'is-loading': isLoading }"
        >
          🎙
        </button>
      </div>
      <div class="control">
        <button
          @click="$refs.file.click()"
          :disabled="isLoading"
          type="button"
          class="button"
          :class="{ 'is-loading': isLoading }"
        >
          🌄
        </button>
        <input
          @change="onFileChange"
          ref="file"
          type="file"
          class="inputfile"
          style="display: none !important;"
        />
      </div>
      <div class="control">
        <button
          :disabled="!message"
          type="submit"
          class="button is-info"
          :class="{ 'is-loading': isLoading }"
        >
          Send
        </button>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  name: "ControlBarComponent",
  props: ["isLoading"],
  data() {
    return {
      message: "",
      photo: null,
      audio: null,
      filter: null
    };
  },
  methods: {
    async onFileChange(event) {
      this.photo = event.target.files[0];
      this.$refs.file.value = null;

      try {
        this.filter = await this.$store.dispatch("utils/requestConfirmation", {
          props: {
            message: "Select your filter",
            file: this.messagePhoto,
            filters: this.$store.state.messages.filters
          },
          component: "FilterModal"
        });
      } catch (error) {
        console.error(error.message);
        this.$toast.error(error.message);
      }
    },
    async recordAudio() {
      try {
        this.audio = await this.$store.dispatch("utils/requestConfirmation", {
          props: {
            message: "Record your voice 🎤"
          },
          component: "RecordModal"
        });
      } catch (error) {
        console.error(error.message);
        this.$toast.error(error.message);
      }
    },
    createMessage() {
      this.$emit("create-message", {
        message: this.message,
        photo: this.photo,
        audio: this.audio,
        filter: this.filter
      });
      this.message = "";
      this.photo = this.filter = this.audio = null;
    }
  },
  computed: {
    messagePhoto() {
      return URL.createObjectURL(this.photo);
    },
    messageAudio() {
      return URL.createObjectURL(this.audio);
    }
  }
};
</script>

<style lang="scss" scoped>
.send {
  background-color: gray;
  padding: 1rem;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  .photo-preview {
    width: 5rem;
    height: 5rem;
    border: 1px solid;
    background-position: center;
    background-size: cover;
    margin-right: 1rem;
    border-radius: 1rem;
    cursor: pointer;
  }
  .audio-preview {
    margin-right: 1rem;
    cursor: pointer;
    position: relative;
    .close {
      position: absolute;
      top: 0;
      right: 0;
      padding: 1rem;
      font-weight: bold;
      background-color: black;
      color: white;
      text-decoration: none;
      z-index: 1;
    }
  }
}

.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > *:first-child {
    flex-grow: 1;
    margin-right: 1rem;
  }
}

.textarea.form__textarea {
  min-height: 4rem;
}
</style>
