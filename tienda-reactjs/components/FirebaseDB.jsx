import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';

  const totalUsers : Object = [];
  const config = {
    apiKey: "AIzaSyBEr9A4fyc-7w6nWkrc7Tq2kwHMcC4uj74",
    authDomain: "tiendaangular2-8d1e6.firebaseapp.com",
    databaseURL: "https://tiendaangular2-8d1e6.firebaseio.com",
    projectId: "tiendaangular2-8d1e6",
    storageBucket: "tiendaangular2-8d1e6.appspot.com",
    messagingSenderId: "269151323747"
  };
  firebase.initializeApp(config);

const productosDb = firebase.database().ref().child('productos')
const usuariosDb = firebase.database().ref().child('usuarios')

usuariosDb.orderByChild("id").on("child_added", function(snapshot) {
  totalUsers.push(snapshot.key)
});
