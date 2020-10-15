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
      roomData: {
        name: "",
        description: ""
      }
    };
  },
  methods: {
    async createRoom() {
      this.isLoading = true;
      try {
        await this.$store.dispatch("rooms/createRoom", {
          name: this.roomData.name,
          description: this.roomData.description
        });
        this.$toast.success("Room created");
        this.roomData.name = this.roomData.description = "";
        setTimeout(() => this.$router.push({ name: "home" }), 1000);
      } catch (error) {
        console.error(error.message);
        this.$toast.error(error.message);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
