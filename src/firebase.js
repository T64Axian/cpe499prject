// นำเข้าโมดูลที่จำเป็นจาก Firebase SDK
import { initializeApp } from 'firebase/app'; // ใช้สำหรับการเริ่มต้นแอป Firebase
import { 
  getFirestore, // ใช้สำหรับเชื่อมต่อกับ Cloud Firestore
  collection,   // ใช้สำหรับเข้าถึงคอลเล็กชันใน Firestore
  addDoc,       // ใช้สำหรับเพิ่มเอกสารใหม่ในคอลเล็กชัน
  deleteDoc,    // ใช้สำหรับลบเอกสารจากคอลเล็กชัน
  doc,          // ใช้สำหรับเข้าถึงเอกสารเฉพาะในคอลเล็กชัน
  onSnapshot,   // ใช้สำหรับฟังการเปลี่ยนแปลงแบบ Real-time
  getDocs       // ใช้สำหรับดึงข้อมูลทั้งหมดจากคอลเล็กชัน
} from 'firebase/firestore'; // นำเข้าฟังก์ชันที่เกี่ยวข้องกับ Firestore

// กำหนดค่าคอนฟิก Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAIh2GSkjE949FMwcJq6BmzgkJgmK7XI3Y",  // กำหนด API Key สำหรับแอป
    authDomain: "currency-converter-4d83d.firebaseapp.com",  // กำหนดโดเมนสำหรับการตรวจสอบสิทธิ์
    projectId: "currency-converter-4d83d",  // กำหนด Project ID
    storageBucket: "currency-converter-4d83d.appspot.com",  // กำหนด Storage Bucket สำหรับการจัดเก็บข้อมูล
    messagingSenderId: "122523385788",  // กำหนด Messaging Sender ID
    appId: "1:122523385788:web:d9efab98672652b30675b9"  // กำหนด App ID สำหรับ Firebase
};

// เริ่มต้นการใช้งาน Firebase ด้วยคอนฟิกที่กำหนดไว้
const app = initializeApp(firebaseConfig);

// สร้างตัวแปรสำหรับเชื่อมต่อกับ Cloud Firestore
const db = getFirestore(app);

// ส่งออกฟังก์ชันต่าง ๆ เพื่อให้สามารถนำไปใช้ในส่วนอื่นของโปรเจกต์ได้
export { db, collection, addDoc, deleteDoc, doc, onSnapshot, getDocs }; // ส่งออก getDocs เพื่อให้สามารถดึงข้อมูลจาก Firestore ได้
