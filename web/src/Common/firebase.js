import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDX3ImVmDcT7oSob7cP3JcyCVF48eMe6cM",
  authDomain: "hotel-management-18739.firebaseapp.com",
  projectId: "hotel-management-18739",
  storageBucket: "hotel-management-18739.appspot.com",
  messagingSenderId: "26669022105",
  appId: "1:26669022105:web:d85cff0427c7669b62b108",
  measurementId: "G-8MVRSSV86N",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
