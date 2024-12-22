// ฟังก์ชัน reportWebVitals ใช้สำหรับการวัดประสิทธิภาพของแอป
const reportWebVitals = onPerfEntry => {
  // ตรวจสอบว่า onPerfEntry มีค่าหรือไม่และเป็นฟังก์ชัน
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // ใช้ dynamic import เพื่อโหลดโมดูล web-vitals ซึ่งมีฟังก์ชันสำหรับการวัดประสิทธิภาพต่าง ๆ
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // เรียกใช้งานฟังก์ชันจาก web-vitals เพื่อวัดประสิทธิภาพต่าง ๆ
      getCLS(onPerfEntry);  // Cumulative Layout Shift (การเปลี่ยนแปลงเค้าโครง)
      getFID(onPerfEntry);  // First Input Delay (การหน่วงเวลาในการตอบสนองจากการป้อนข้อมูลครั้งแรก)
      getFCP(onPerfEntry);  // First Contentful Paint (เวลาในการแสดงผลเนื้อหาแรก)
      getLCP(onPerfEntry);  // Largest Contentful Paint (เวลาในการแสดงผลเนื้อหาขนาดใหญ่สุด)
      getTTFB(onPerfEntry); // Time to First Byte (เวลาในการรับข้อมูลจากเซิร์ฟเวอร์)
    });
  }
};

// ส่งออกฟังก์ชัน reportWebVitals เพื่อให้สามารถใช้ในที่อื่นได้
export default reportWebVitals;
