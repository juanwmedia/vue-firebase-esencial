<template>
  <div class="home"></div>
</template>

<script>
import { db } from "../firebase";
export default {
  name: "RoomsView",
  async created() {
    // Set
    const user = { name: "Juan Andrés", city: "Valencia", country: "Spain" };
    await db
      .collection("users")
      .doc("juanwmedia")
      .set(user, { merge: true });

    // Add
    //await db.collection("users").add(user);

    // Get new ID and then add
    const newDocRef = db.collection("users").doc();
    const newId = newDocRef.id;
    await newDocRef.set({ name: "Guizmo", created: Date.now(), id: newId });
  }
};
</script>
