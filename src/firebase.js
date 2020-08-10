import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDIy1AMZheEa4nQfaAOfIIZ618LIViOszI",
  authDomain: "vuetalk-f3e07.firebaseapp.com",
  databaseURL: "https://vuetalk-f3e07.firebaseio.com",
  projectId: "vuetalk-f3e07",
  storageBucket: "vuetalk-f3e07.appspot.com",
  messagingSenderId: "758239189261",
  appId: "1:758239189261:web:75bcc2041179f6f0feb844"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
