<template>
  <div class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <h3 class="subtitle is-size-4 is-marginless">
          Confirmation
        </h3>
      </header>
      <section class="modal-card-body">
        <h3 class="subtitle has-text-centered">{{ message }}</h3>
      </section>
      <footer class="modal-card-foot buttons is-right">
        <button @click="$emit('confirm')" class="button" :class="actionClass">
          Confirm
        </button>
        <button @click="$emit('cancel')" class="button">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfirmationModalComponent",
  props: {
    message: {
      type: String,
      required: true
    },
    actionClass: {
      type: String,
      default: "is-danger"
    }
  }
};
</script>

<style scoped>
.modal {
  display: block;
}
</style>
