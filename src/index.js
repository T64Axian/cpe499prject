// นำเข้า React และ ReactDOM สำหรับการเรนเดอร์แอปพลิเคชัน
import React from 'react';
import ReactDOM from 'react-dom/client';


import App from './App';// นำเข้าแอปคอมโพเนนต์หลักจากไฟล์ App.js
import reportWebVitals from './reportWebVitals';// นำเข้า reportWebVitals ซึ่งใช้สำหรับการวัดประสิทธิภาพของแอป

// สร้าง root element สำหรับ React ที่จะทำการเรนเดอร์แอป
const root = ReactDOM.createRoot(document.getElementById('root'));
// เรนเดอร์แอปพลิเคชันในโหมด StrictMode ซึ่งจะช่วยตรวจสอบข้อผิดพลาดและการใช้งานที่ไม่ปลอดภัยในโค้ด
root.render(
  <React.StrictMode>
    <App /> {/* Render Component ของแอป */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
