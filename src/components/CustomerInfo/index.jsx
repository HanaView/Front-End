// src/components/CustomerInfo/index.jsx
import React from 'react';
import './style.scss';

const CustomerInfo = ({ name, phoneNumber, idNumber, idImage }) => {
  return (
    <div className="customerInfo">
      <h2>{name} 님</h2>
      <p>휴대폰 번호: <br/>{phoneNumber}</p>
      <p>주민등록번호: <br/>{idNumber}</p>
      <div id='idContainer'>
        <img src={idImage} alt="ID" />
      </div>
    </div>
  );
};

export default CustomerInfo;