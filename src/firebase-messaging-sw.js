/// <reference lib="webworker" />

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB9saUlUIZyeIvyLInZijWfHMGLdnE2oVk",
  authDomain: "nazzem-5424a.firebaseapp.com",
  projectId: "nazzem-5424a",
  storageBucket: "nazzem-5424a.appspot.com",
  messagingSenderId: "83738018760",
  appId: "1:83738018760:web:213ed90144a41562f376fd"
});

const messaging = firebase.messaging();
