import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
// import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyD-acZSb1EJ5C8MOIu0lT3akUKoFu0lQvA",
    authDomain: "footbackapi.firebaseapp.com",
    projectId: "footbackapi",
    storageBucket: "footbackapi.firebasestorage.app",
    messagingSenderId: "253336428814",
    appId: "1:253336428814:web:e5144d0b47e1bc77fbf75f",
    measurementId: "G-N8HP8K9YX4"
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const analytics: Analytics = getAnalytics(app);
// const messaging: Messaging = getMessaging(app);

// const getFCMToken = async (): Promise<string | null> => {
//     try {
//         const currentToken = await getToken(messaging, {
//             vapidKey: 'BGzCk1XlL1VbqxeNnM01zaaRY1RnZhEoHF9PRUbv4Jpxj2EUILHEJtHExlIwJa9KHTrSNh56cmFH3p7WG0Cqu3c'
//         });
//         if(currentToken) {
//             console.log('FCM Token:', currentToken);
//             return currentToken;
//         } else {
//             console.log('Không thể lấy token. Yêu cầu quyền thông báo.');
//             return null;
//         }
//     } catch (error) {
//         console.error('Lỗi khi lấy FCM token:', error);
//         return null;
//     }
// };

export {
    app,
    analytics,
    // messaging,
    // getFCMToken,
    // onMessage
};
