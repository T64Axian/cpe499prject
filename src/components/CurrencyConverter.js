import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db, collection, addDoc, deleteDoc, doc, onSnapshot, getDocs } from '../firebase'; // ใช้ onSnapshot แทน getDocs เพื่อฟังข้อมูลแบบ Real-Time
import '../style/currencyConverter.css'; // นำเข้าไฟล์ CSS สำหรับการแสดงผลของ Currency Converter

function CurrencyConverter() {
  // สร้าง state สำหรับการจัดการข้อมูล
  const [amount, setAmount] = useState(1);  // จำนวนเงินที่ต้องการแปลง
  const [convertedAmount, setConvertedAmount] = useState(0); // จำนวนเงินที่แปลงแล้ว
  const [exchangeRates, setExchangeRates] = useState({}); // อัตราแลกเปลี่ยน
  const [fromCurrency, setFromCurrency] = useState('USD');  // สกุลเงินที่ต้องการแปลง
  const [toCurrency, setToCurrency] = useState('THB');  // สกุลเงินที่จะแปลงไป
  const [loading, setLoading] = useState(true);  // สถานะการโหลดข้อมูล
  const [exchangeHistory, setExchangeHistory] = useState([]);  // ประวัติการแปลงสกุลเงิน

  // ฟังก์ชันดึงข้อมูลอัตราแลกเปลี่ยนจาก API เมื่อจากเปลี่ยนสกุลเงินต้น
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/a20d39beb622510971171fb7/latest/${fromCurrency}`);
        setExchangeRates(response.data.conversion_rates); // เก็บอัตราแลกเปลี่ยนที่ได้รับ
        setLoading(false);  // หยุดการโหลดข้อมูล
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        setLoading(false);  // หยุดการโหลดข้อมูลเมื่อเกิดข้อผิดพลาด
      }
    };

    fetchExchangeRate(); // เรียกใช้งานฟังก์ชัน
  }, [fromCurrency]); // ทำงานใหม่ทุกครั้งเมื่อจากสกุลเงินต้นเปลี่ยนแปลง

  // ฟังก์ชันคำนวณจำนวนเงินที่แปลงแล้ว
  useEffect(() => {
    if (exchangeRates[toCurrency]) {
      setConvertedAmount((amount * exchangeRates[toCurrency]).toFixed(2)); // คำนวณการแปลงสกุลเงิน
    }
  }, [amount, exchangeRates, toCurrency]); // ทำงานใหม่เมื่อจำนวนเงินหรืออัตราแลกเปลี่ยนเปลี่ยนแปลง

  // Real-Time Listener ที่ฟังการเปลี่ยนแปลงใน Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'currencyExchangeRates'), (querySnapshot) => {
      const history = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      }));
      setExchangeHistory(history); // อัปเดตประวัติการแปลง
    });

    return () => unsubscribe(); // ทำการยกเลิกการฟังเมื่อ component ถูกลบ
  }, []); // ทำงานเพียงครั้งเดียวเมื่อ component โหลด

  // ฟังก์ชันบันทึกข้อมูลลง Firebase
  const saveDataToFirebase = async () => {
    try {
      await addDoc(collection(db, 'currencyExchangeRates'), {
        amount,
        fromCurrency,
        toCurrency,
        convertedAmount,
        timestamp: new Date(),
      });
      alert('Data saved successfully!');  // แสดงข้อความเมื่อบันทึกสำเร็จ
    } catch (e) {
      console.error('Error adding document: ', e);  // แสดงข้อผิดพลาดหากเกิดข้อผิดพลาดในการบันทึกข้อมูล
    }
  };

  // ฟังก์ชันลบข้อมูลจาก Firebase
  const deleteDataFromFirebase = async (id) => {
    try {
      const docRef = doc(db, 'currencyExchangeRates', id);
      await deleteDoc(docRef);  // ลบข้อมูลจาก Firestore
    } catch (e) {
      console.error('Error deleting document: ', e);  // แสดงข้อผิดพลาดหากเกิดข้อผิดพลาดในการลบข้อมูล
    }
  };

  // ลบข้อมูลทั้งหมดเมื่อปิดหรือรีโหลดเว็บ
  useEffect(() => {
    const clearDataOnUnload = () => {
      getDocs(collection(db, 'currencyExchangeRates')).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          deleteDoc(doc.ref); // ลบเอกสารทั้งหมด
        });
      });
    };

    window.onbeforeunload = () => {
      clearDataOnUnload(); // ลบข้อมูลเมื่อผู้ใช้ปิดหรือรีโหลดหน้าเว็บ
    };

    return () => {
      window.onbeforeunload = null; // ลบการตั้งค่าเมื่อ component ถูก unmount
    };
  }, []); // ทำงานเพียงครั้งเดียวเมื่อโหลด component 

  return (
    <div className="currency-converter">
      <h1>Currency Converter</h1>

      {/* เลือกสกุลเงินต้น */}
      <div>
        <label htmlFor="fromCurrency">From Currency: </label>
        <select
          id="fromCurrency"
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)} // เมื่อเลือกสกุลเงินต้องแปลง
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
          <option value="AUD">AUD</option>
          <option value="THB">THB</option>
        </select>
      </div>

      {/* จำนวนเงินที่ต้องการแปลง */}
      <div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}  // เมื่อจำนวนเงินแปลง
          placeholder={`Enter amount in ${fromCurrency}`}
        />
      </div>

      {/* เลือกสกุลเงินที่ต้องการแปลงไป */}
      <div>
        <label htmlFor="toCurrency">To Currency: </label>
        <select
          id="toCurrency"
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)} // เมื่อเลือกสกุลเงินที่แปลงไปเปลี่ยนแปลง
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
          <option value="AUD">AUD</option>
          <option value="THB">THB</option>
        </select>
      </div>

      {/* แสดงผลลัพธ์เมื่อโหลดข้อมูลเสร็จ */}
      {loading ? (
        <p>Loading exchange rates...</p>  // แสดงข้อความขณะโหลดข้อมูล
      ) : (
        <div>
          <p>
            {amount} {fromCurrency} = {convertedAmount} {toCurrency} {/* แสดงผลลัพธ์การแปลง */}
          </p>
        </div>
      )}

      <button onClick={saveDataToFirebase}>Save</button> {/* ปุ่มบันทึกข้อมูล */}

      <h2>Exchange History</h2>
      {/* แสดงประวัติการแปลง */}
      <ul>
        {exchangeHistory.map((record) => (
          <li key={record.id}>
            {record.amount} {record.fromCurrency} = {record.convertedAmount} {record.toCurrency} - 
            {record.timestamp instanceof Date && !isNaN(record.timestamp) ? 
            record.timestamp.toLocaleString() : 'Invalid Date'}
            <button onClick={() => deleteDataFromFirebase(record.id)}>Delete</button>  {/* ปุ่มลบข้อมูล */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CurrencyConverter;
