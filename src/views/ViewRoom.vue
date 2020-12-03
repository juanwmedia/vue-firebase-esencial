<template>
  <div>
    <article class="section">
      <div class="container">
        <div class="columns">
          <div v-if="room" class="column is-half is-offset-one-quarter">
            <h1 class="title has-text-centered">{{ room.name }}</h1>
            <div class="messages content" ref="messages">
              <div v-for="message in roomMessages" :key="message.id">
                <MessageComponent
                  :message="message"
                  @delete-message="deleteMessage"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
    <ControlBarComponent
      :is-loading="isLoading"
      @create-message="createMessage"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import MessageComponent from "@/components/MessageComponent.vue";
import ControlBarComponent from "@/components/ControlBarComponent.vue";
export default {
  name: "ViewRoom",
  async created() {
    this.userUid = this.$store.state.user.user.uid;
    try {
      this.room = await this.$store.dispatch("rooms/getRoom", this.id);
      this.$store.dispatch("user/updateMeta", {
        roomID: this.id,
        exit: false,
        uid: this.userUid
      });
    } catch (error) {
      console.error(error.message);
      this.$toast.error(error.message);
      this.$router.push({ name: "home" });
    }
  },
  destroyed() {
    this.$store.dispatch("user/updateMeta", {
      roomID: this.id,
      exit: true,
      uid: this.userUid
    });
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      userUid: null,
      isLoading: false,
      photoURL: null,
      audioURL: null,
      room: null
    };
  },
  methods: {
    scrollDown() {
      const messages = this.$refs.messages;
      this.$nextTick(() => {
        const height = messages.scrollHeight;
        window.scrollTo({
          top: height,
          behavior: "smooth"
        });
      });
    },
    async createMessage({ message, photo, audio, filter }) {
      this.isLoading = true;
      try {
        if (photo) {
          this.photoURL = await this.$store.dispatch(
            "messages/uploadMessageFile",
            {
              roomID: this.id,
              file: photo,
              type: "photo"
            }
          );
        }
        if (audio) {
          this.audioURL = await this.$store.dispatch(
            "messages/uploadMessageFile",
            {
              roomID: this.id,
              file: audio,
              type: "audio"
            }
          );
        }
        await this.$store.dispatch("messages/createMessage", {
          roomID: this.id,
          message: message,
          photo: this.photoURL,
          filter: filter,
          audio: this.audioURL
        });
        this.scrollDown();
        this.photoURL = this.audioURL = null;
      } catch (error) {
        console.error(error.message);
        this.$toast.error(error.message);
      } finally {
        this.isLoading = false;
      }
    },
    async deleteMessage(messageID) {
      try {
        await this.$store.dispatch("utils/requestConfirmation", {
          props: { message: "¿Delete message" },
          component: "ConfirmationModal"
        });

        const message = this.roomMessages.find(
          message => message.id === messageID
        );

        if (message.photo) {
          await this.$store.dispatch("messages/deleteFile", message.photo);
        }

        if (message.audio) {
          await this.$store.dispatch("messages/deleteFile", message.audio);
        }

        await this.$store.dispatch("messages/deleteMessage", {
          roomID: this.id,
          messageID
        });

        this.$toast.success("Message deleted");
      } catch (error) {
        console.error(error.message);
        this.$toast.error(error.message);
      }
    }
  },
  computed: {
    ...mapState("messages", ["messages"]),
    roomMessages() {
      return this.messages.filter(message => message.roomId === this.id);
    }
  },
  components: {
    MessageComponent,
    ControlBarComponent
  }
};
</script>

<style lang="scss" scoped>
.messages {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding-bottom: 90px;
}
</style>
