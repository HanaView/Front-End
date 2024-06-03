// src/components/CustomerInfo/index.jsx
import React from 'react';
import './style.scss';

const CustomerInfo = ({ name, phoneNumber, idNumber, idImage }) => {
  return (
    <div className="customerInfo">
      <h2>{name}</h2>
      <p>휴대폰 번호: {phoneNumber}</p>
      <p>주민등록번호: {idNumber}</p>
      <img src={idImage} alt="ID" />
    </div>
  );
};

export default CustomerInfo;
