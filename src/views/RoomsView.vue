<template>
  <div class="home"></div>
</template>

<script>
import { db } from "../firebase";
export default {
  name: "RoomsView",
  async created() {
    // Query documents and collections
    const collectionRef = db.collection("users");

    const query = await collectionRef
      .where("name", "==", "Guizmo")
      .orderBy("created", "asc")
      .get();

    query.forEach(querySnapshot => console.log(querySnapshot.data()));
  }
};
</script>
