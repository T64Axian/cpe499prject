// src/App.js
import React from 'react';
import CurrencyConverter from './components/CurrencyConverter';  // นำเข้า Component ที่สร้างขึ้น

function App() {
  return (
    <div className="App">
      <CurrencyConverter />  {/* เรียกใช้ Component CurrencyConverter */}
    </div>
  );
}

export default App;
