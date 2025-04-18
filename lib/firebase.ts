import { initializeApp } from "firebase/app"
import { getDatabase, ref, query, orderByKey, limitToLast, get, onValue, off } from "firebase/database"

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDalcCwwOthPMjC3umkpQECqlQQj699FTY",
  authDomain: "staklimjerukagung.firebaseapp.com",
  databaseURL: "https://staklimjerukagung-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "staklimjerukagung",
  storageBucket: "staklimjerukagung.appspot.com",
  messagingSenderId: "763003005982",
  appId: "1:763003005982:web:8ce295eda92c6b9112d20f",
  measurementId: "G-DRL05TMRNT",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export { database, ref, query, orderByKey, limitToLast, get, onValue, off }
