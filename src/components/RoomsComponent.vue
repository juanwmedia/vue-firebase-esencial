<template>
  <div v-if="!$store.state.isLoading">
    <h1 v-if="!rooms.length" class="subtitle has-text-centered mt-2">
      No rooms avaibale.
      <router-link :to="{ name: 'create' }">Create one</router-link>.
    </h1>
    <div v-else class="columns is-multiline">
      <!-- Room element -->
      <div v-for="room in rooms" :key="room.id" class="column is-one-third">
        <div class="card">
          <div class="card-image">
            <figure class="image is-16by9">
              <img
                src="https://bulma.io/images/placeholders/1280x960.png"
                alt="Placeholder image"
              />
            </figure>
          </div>
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
          </div>
        </div>
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
    }
  }
};
</script>
