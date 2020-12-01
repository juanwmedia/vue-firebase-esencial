<template>
  <div class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <h3 class="subtitle is-size-4 is-marginless">
          {{ message }}
        </h3>
      </header>
      <section class="modal-card-body has-text-centered">
        <button v-if="!recorder" @click="record()" class="button is-info">
          Start recording
        </button>
        <button v-else @click="stop()" class="button is-danger">
          Stop recording
        </button>
        <div class="mt-5" v-if="audio">
          <h5 class="subtitle is-marginless mb-1">Review your recording</h5>
          <audio :src="newAudioURL" controls></audio>
        </div>
      </section>
      <footer class="modal-card-foot buttons is-right">
        <button
          :disabled="!audio"
          @click="$emit('confirm', audio)"
          class="button"
          :class="actionClass"
        >
          Confirm
        </button>
        <button @click="$emit('cancel')" class="button">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecordModalComponent",
  props: {
    message: {
      type: String,
      required: true
    },
    actionClass: {
      type: String,
      default: "is-success"
    }
  },
  data() {
    return {
      audio: null,
      recorder: null
    };
  },
  methods: {
    async record() {
      try {
        this.audio = null;
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        });

        const options = { mimeType: "audio/webm" };
        const recordedChunks = [];
        this.recorder = new MediaRecorder(stream, options);

        this.recorder.addEventListener("dataavailable", e => {
          if (e.data.size > 0) {
            recordedChunks.push(e.data);
          }
        });

        this.recorder.addEventListener("stop", () => {
          this.audio = new Blob(recordedChunks);
        });

        this.recorder.start();
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
    stop() {
      this.recorder.stop();
      this.recorder = null;
    }
  },
  computed: {
    newAudioURL() {
      return URL.createObjectURL(this.audio);
    }
  }
};
</script>

<style scoped>
.modal {
  display: block;
}
</style>
