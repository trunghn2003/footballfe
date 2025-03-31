importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyD-acZSb1EJ5C8MOIu0lT3akUKoFu0lQvA",
    authDomain: "footbackapi.firebaseapp.com",
    projectId: "footbackapi",
    storageBucket: "footbackapi.firebasestorage.app",
    messagingSenderId: "253336428814",
    appId: "1:253336428814:web:e5144d0b47e1bc77fbf75f",
    measurementId: "G-N8HP8K9YX4"
});

const messaging = firebase.messaging();

// Optional: Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png'
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});
