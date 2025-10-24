import {initializeApp} from 'firebase/app';
// import 'firebase/storage';
// import 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics";
//+ firestore
const firebaseConfig = {
    apiKey: "AIzaSyBmZbmGCagUCdssB3BNf1E7XYQAjOD_0Yo",
    authDomain: "junter.firebaseapp.com",
    projectId: "junter",
    storageBucket: "junter.appspot.com",
    messagingSenderId: "823982785624",
    appId: "1:823982785624:web:932dbc7e4a14c57b07b62d",
    measurementId: "G-SRQ51SGHWF"
  };


  // Inicializa Firebase
const firebaseApp = initializeApp(firebaseConfig)



export default firebaseApp

// export const analytics = getAnalytics(app);
// export const auth = firebase.auth();
// export const googleProvider = new firebase.auth.GoogleAuthProvider();









