<template>
  <div class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <section class="modal-card-body">
        <h3 class="subtitle has-text-centered is-size-4 is-marginless">
          {{ message }}
        </h3>

        <div class="photo">
          <img class="photo__image" :src="file" :class="activeFilter" />
        </div>

        <div class="filters">
          <div
            :class="{
              'filters__filter--selected': filter.name === activeFilter,
              [filter.name]: true
            }"
            class="filters__filter"
            v-for="(filter, $index) in filters"
            :key="$index"
          >
            <img
              @click="activeFilter = filter.name"
              class="filters__filter__image"
              :src="file"
            />
            <h4 class="filters__filter__name">{{ filter.name }}</h4>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot buttons is-right">
        <button
          @click="$emit('confirm', activeFilter)"
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
  name: "FilterModalComponent",
  props: {
    file: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    filters: {
      type: Array,
      required: true
    },
    actionClass: {
      type: String,
      default: "is-info"
    }
  },
  data() {
    return {
      activeFilter: "normal"
    };
  }
};
</script>

<style lang="scss" scoped>
.modal {
  display: block;
}

.photo {
  padding: 0.5rem;
  width: 100%;
  &__image {
    width: 100%;
    height: auto;
  }
}

.filters {
  padding: 0.5rem;
  overflow: scroll;
  display: flex;
  &__filter {
    position: relative;
    cursor: pointer;
    margin: 0.3rem;
    &--selected {
      border: 3px solid orange;
    }
    &__image {
      width: 20vmax;
      height: auto;
      max-width: 20vmax;
      display: block;
    }
    &__name {
      position: absolute;
      left: 0;
      bottom: 0;
      text-align: center;
      width: 100%;
      color: white;
      background-color: rgba(0, 0, 0, 0.7);
    }
  }
}
</style>
