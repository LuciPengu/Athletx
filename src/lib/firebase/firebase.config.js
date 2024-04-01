import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyD5G0k47hdKwYB4j-Y2FFrH-yFbCnzyPX8",
  authDomain: "xathlete-38c1f.firebaseapp.com",
  projectId: "xathlete-38c1f",
  storageBucket: "xathlete-38c1f.appspot.com",
  messagingSenderId: "801513724226",
  appId: "1:801513724226:web:d011a645c9e3061efc50db",
  measurementId: "G-7ERGZ746BB",
  databaseURL: "https://xathlete-38c1f-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);


/*
on load do ml stuff
*/

export { auth, db, storage };
