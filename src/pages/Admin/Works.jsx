import React from 'react';
import './App.css';

const records = [
  { 순서: '박진수', 상담분류: '대출', 제목: '대출 만기일...', 내용: '대출 만기일...', 팔자: '강백호', 상담일시: '18:35:53' },
  { 순서: '박진수', 상담분류: '대출', 제목: '대출 만기일...', 내용: '매입 가격 협의', 팔자: '강백호', 상담일시: '18:27:45' },
  // Add more records as necessary
];

function Works() {
  return (
      <MainContent records={records} />
  );
}


function MainContent({ records }) {
  return (
    <div className="MainContent">
      <h2>업무 기록 관리</h2>
      <table>
        <thead>
          <tr>
            <th>순서</th>
            <th>상담 분류</th>
            <th>제목</th>
            <th>내용</th>
            <th>팔자</th>
            <th>상담 일시</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.순서}</td>
              <td>{record.상담분류}</td>
              <td>{record.제목}</td>
              <td>{record.내용}</td>
              <td>{record.팔자}</td>
              <td>{record.상담일시}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="Footer">
        <p>© 2024 HANAVIEW. ALL RIGHTS RESERVED.</p>
      </div>
    </div>
  );
}
export default Works;