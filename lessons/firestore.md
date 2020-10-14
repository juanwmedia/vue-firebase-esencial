## Set elements

```javascript
const user = { name: "Juan Andrés", city: "Valencia", country: "Spain" };
await db
  .collection("users")
  .doc("juanwmedia")
  .set(user, { merge: true });
```

## Add elements

```javascript
await db.collection("users").add(user);
//Get new ID and then add
const newDocRef = db.collection("users").doc();
const newId = newDocRef.id;
await newDocRef.set({ name: "Guizmo", created: Date.now(), id: newId });
```

## Update part of a document

```javascript
const uniqueId = "9ZLdjKqNPBPwQMrpRd60";
await db
  .collection("users")
  .doc(uniqueId)
  .update({ name: "Super Guizmo", specie: "black cat" });
```

## Deleting a document

```javascript
await db;
  .collection("users")
  .doc(uniqueId)
  .delete();
```

## Read a document

```javascript
const document = await db;
  .collection("users")
  .doc("juanwmedia")
  .get();
console.log(document.data());
console.log(document.id); // Document ID
console.log(document.exists); // Document exists (or not)
```

## Read all documents from a collection

```javascript
const collection = await db.collection("users").get();
collection.forEach((doc) => console.log(doc.id, doc.data()));
```

## Read a document from a subcollection

```javascript
const subDocument = await db;
  .collection("users")
  .doc("juanwmedia")
  .collection("meta")
  .doc("books")
  .get();
const subDocument = await db.doc("users/juanwmedia/meta/books").get();
console.log(subDocument.data());
```

## Listen for changes

```javascript
db.collection("users");
  .doc("juanwmedia")
  .onSnapshot(docSnapshot => console.log(docSnapshot.data()));
```

## Listen for query changes

```javascript
db.collection("users")
  .where("name", "==", "Guizmo")
  .onSnapshot((querySnapshot) =>
    querySnapshot.forEach((docSnapshot) => console.log(docSnapshot.id))
  );
```

## Listen for query type changes

```javascript
const unsub = db
  .collection("users")
  .where("name", "==", "Guizmo")
  .onSnapshot((querySnapshot) =>
    querySnapshot.docChanges().forEach((change) => {
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
```

## Query documents and collections

```javascript
const collectionRef = db.collection("users");

const query = await collectionRef.where("name", "==", "Guizmo").get();
query.forEach((querySnapshot) => console.log(querySnapshot.data().id));

const query = await collectionRef.where("created", "!=", false).get();
query.forEach((querySnapshot) => console.log(querySnapshot.data()));

const query = await collectionRef
  .where("name", "in", ["Guizmo", "Juan Andrés"])
  .get();
query.forEach((querySnapshot) => console.log(querySnapshot.data()));

const query = await collectionRef
  .where("favs", "array-contains-any", ["dusk", "rain"])
  .get();
query.forEach((querySnapshot) => console.log(querySnapshot.id));

const query = await collectionRef
  .where("name", "==", "Guizmo")
  .limit(3)
  .get();
query.forEach((querySnapshot) => console.log(querySnapshot.data()));

const query = await collectionRef.orderBy("name", "desc").get();
query.forEach((querySnapshot) => console.log(querySnapshot.data().name));

const query = await collectionRef
  .where("created", "<", Date.now())
  .orderBy("created", "desc")
  .limit(1)
  .get();

query.forEach((querySnapshot) => console.log(querySnapshot.data()));
```
