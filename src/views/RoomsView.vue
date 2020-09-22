<template>
  <div class="home"></div>
</template>

<script>
import { db } from "../firebase";
export default {
  name: "RoomsView",
  async created() {
    // Set
    // const user = { name: "Juan Andrés", city: "Valencia", country: "Spain" };
    // await db
    //   .collection("users")
    //   .doc("juanwmedia")
    //   .set(user, { merge: true });
    // Add
    //await db.collection("users").add(user);
    // Get new ID and then add
    //const newDocRef = db.collection("users").doc();
    //const newId = newDocRef.id;
    //await newDocRef.set({ name: "Guizmo", created: Date.now(), id: newId });
    // Update part of a document
    // const uniqueId = "9ZLdjKqNPBPwQMrpRd60";
    // await db
    //   .collection("users")
    //   .doc(uniqueId)
    //   .update({ name: "Super Guizmo", specie: "black cat" });
    // Deleting a document
    // await db
    //   .collection("users")
    //   .doc(uniqueId)
    //   .delete();
    // Read a document
    // const document = await db
    //   .collection("users")
    //   .doc("juanwmedia")
    //   .get();
    // console.log(document.data());
    // console.log(document.id); // Document ID
    // console.log(document.exists); // Document exists (or not)
    // Read all documents from a collection
    // const collection = await db.collection("users").get();
    // collection.forEach(doc => console.log(doc.id, doc.data()));
    // Read a document from a subcollection
    // const subDocument = await db
    //   .collection("users")
    //   .doc("juanwmedia")
    //   .collection("meta")
    //   .doc("books")
    //   .get();
    // const subDocument = await db.doc("users/juanwmedia/meta/books").get();
    // console.log(subDocument.data());

    // Listen for changes
    // db.collection("users")
    //   .doc("juanwmedia")
    //   .onSnapshot(docSnapshot => console.log(docSnapshot.data()));

    // Listen for query changes
    // db.collection("users")
    //   .where("name", "==", "Guizmo")
    //   .onSnapshot(querySnapshot =>
    //     querySnapshot.forEach(docSnapshot => console.log(docSnapshot.id))
    //   );

    // Listen for query type changes
    const unsub = db
      .collection("users")
      .where("name", "==", "Guizmo")
      .onSnapshot(querySnapshot =>
        querySnapshot.docChanges().forEach(change => {
          if (change.type === "added") {
            console.log("Added : ", change.doc.data());
          }

          if (change.type === "modified") {
            console.log("Modified : ", change.doc.data());
          }

          if (change.type === "removed") {
            console.log("Removed : ", change.doc.data());
          }
        })
      );

    unsub();
  }
};
</script>
