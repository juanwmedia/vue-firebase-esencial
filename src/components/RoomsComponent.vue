<template>
  <div v-if="!$store.state.isLoading">
    <h1 v-if="!rooms.length" class="subtitle has-text-centered mt-2">
      No rooms avaibale.
      <router-link :to="{ name: 'create' }">Create one</router-link>.
    </h1>
    <div v-else class="columns is-multiline">
      <!-- Room element -->
      <div v-for="room in rooms" :key="room.id" class="column is-one-third">
        <router-link :to="{ name: 'view', params: { id: room.id } }">
          <div
            class="card room"
            :class="{ unread: hasUnreadMessages(room.id).length }"
          >
            <div v-if="hasUnreadMessages(room.id).length" class="unread-alert">
              {{ hasUnreadMessages(room.id).length }} unread messages 🔥
            </div>
            <div
              class="card-image room__image"
              :style="{ 'background-image': `url(${getRoomImage(room.id)})` }"
            ></div>
            <div class="card-content">
              <div class="media">
                <div class="media-content">
                  <p class="title is-4">{{ room.name }}</p>
                  <p class="subtitle is-6">by {{ room.adminName }}</p>
                </div>
              </div>
              <div class="content">
                {{ room.description }}
              </div>
              <nav class="buttons is-right">
                <router-link
                  :to="{ name: 'update', params: { id: room.id } }"
                  class="button is-small"
                  v-if="room.adminUid === $store.getters['user/getUserUid']"
                  >Edit</router-link
                >
              </nav>
            </div>
          </div>
        </router-link>
      </div>
      <!-- End of room element -->
    </div>
  </div>
</template>

<script>
export default {
  name: "RoomsComponent",
  props: {
    rooms: {
      type: Array,
      required: true
    },
    unreadMessages: {
      type: Array
    }
  },
  methods: {
    getRoomImage(roomId) {
      const room = this.rooms.find(room => room.id === roomId);
      return room.image ? room.image : require("@/assets/img/room-image.jpg");
    },
    hasUnreadMessages(roomId) {
      return this.unreadMessages.filter(message => {
        return message.roomId === roomId;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.room {
  position: relative;
  &.unread {
    border: 3px solid orange;
    animation: slidein 0.6s infinite alternate ease-in-out;
  }
  .unread-alert {
    position: absolute;
    top: 0;
    right: 0;
    background-color: orange;
    padding: 1rem;
    z-index: 2;
  }
  .room__image {
    height: 15vmax;
    background-size: cover;
    background-position: center;
  }
}

@keyframes slidein {
  from {
    transform: translateY(-1rem);
  }
  to {
    transform: translateY(1rem);
  }
}
</style>
