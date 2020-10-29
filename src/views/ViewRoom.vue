<template>
  <div>
    <article class="section">
      <div class="container">
        <div class="columns">
          <div v-if="room" class="column is-half is-offset-one-quarter">
            <h1 class="title has-text-centered">{{ room.name }}</h1>
            <div class="messages content" ref="messages">
              <div
                v-for="message in messages"
                :key="message.id"
                class="message"
                :class="{
                  'message--own':
                    message.userId === $store.getters['user/getUserUid']
                }"
              >
                <p>
                  {{ message.message }}
                  <span
                    v-if="message.userId !== $store.getters['user/getUserUid']"
                  >
                    <br />
                    <small class="message__time">
                      <i
                        >{{ message.userName }}
                        {{ message.createdAt | timeAgo }} ago</i
                      >
                    </small>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
    <section class="send">
      <form @submit.prevent="createMessage" class="form">
        <div class="control">
          <textarea
            v-model="message"
            class="textarea form__textarea"
            placeholder="Write your message here..."
          ></textarea>
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
  </div>
</template>

<script>
import { mapState } from "vuex";
const dayjs = require("dayjs");
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default {
  name: "ViewRoom",
  async created() {
    try {
      this.room = await this.$store.dispatch("rooms/getRoom", this.id);
      this.$store.dispatch("messages/getMessages", this.id);
    } catch (error) {
      console.error(error.message);
      this.$toast.error(error.message);
      this.$router.push({ name: "home" });
    }
  },
  destroyed() {
    this.$store.commit("messages/setMessagesListener", null);
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      message: "",
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
    async createMessage() {
      this.isLoading = true;
      try {
        await this.$store.dispatch("messages/createMessage", {
          roomID: this.id,
          message: this.message
        });
        this.scrollDown();
        this.message = "";
      } catch (error) {
        console.error(error.message);
        this.$toast.error(error.message);
      } finally {
        this.isLoading = false;
      }
    }
  },
  filters: {
    timeAgo(timestamp) {
      const date = new Date(timestamp);
      return dayjs().from(dayjs(date), true);
    }
  },
  computed: {
    ...mapState("messages", ["messages"])
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

.message {
  padding: 1rem;
  width: 75%;
  &--own {
    background-color: #baffc5;
    width: 75%;
    align-self: flex-end;
  }
  &__time {
    color: gray;
    font-size: 12px;
  }
}

.send {
  background-color: gray;
  padding: 1rem;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
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
