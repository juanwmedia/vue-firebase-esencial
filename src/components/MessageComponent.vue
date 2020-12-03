<template>
  <div
    class="message"
    :class="{
      'message--own': message.userId === $store.getters['user/getUserUid']
    }"
  >
    <!-- Delete message -->
    <a
      href="#"
      v-if="message.userId === $store.getters['user/getUserUid']"
      @click="$emit('delete-message', message.id)"
      class="message__delete is-pulled-right button is-small is-danger is-outlined"
      >X</a
    >
    <!-- Message has photo -->
    <div
      v-if="message.photo"
      class="message__photo"
      :class="message.filter"
      :style="{ 'background-image': `url(${message.photo})` }"
    ></div>

    <!-- Message has audio -->
    <div v-if="message.audio" class="message__audio">
      <audio :src="message.audio" controls></audio>
    </div>

    <p>
      {{ message.message }}
      <span v-if="message.userId !== $store.getters['user/getUserUid']">
        <br />
        <small class="message__time">
          <i>{{ message.userName }} {{ message.createdAt | timeAgo }} ago</i>
        </small>
      </span>
    </p>
  </div>
</template>

<script>
const dayjs = require("dayjs");
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
export default {
  name: "MessageComponent",
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  filters: {
    timeAgo(timestamp) {
      const date = new Date(timestamp);
      return dayjs().from(dayjs(date), true);
    }
  }
};
</script>

<style lang="scss" scoped>
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
  &__photo {
    height: 20vmax;
    background-size: cover;
    background-position: center;
  }
  &__delete {
    position: relative;
    z-index: 1;
    margin-bottom: 1rem;
  }
}
</style>
