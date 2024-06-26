import React from "react";
import "./App.scss";

const records = [

  // 369예금 -> 내맘적금 -> 트래블로그 체크
  {
    번호: "11",
    손님: "박병철",
    상담분류: "카드",
    별점: "5",
    내용: "유다영 텔러님께서 정기 예금 상품에 대해 아주 자세히 설명해 주셨고, 가입 절차도 빠르게 진행해 주셨습니다.",
    텔러: "유다영",
    상담일시: "17:45:20"
  },
  {
    번호: "10",
    손님: "박병철",
    상담분류: "적금",
    별점: "5",
    내용: "유다영 텔러님께서 정기 예금 상품에 대해 아주 자세히 설명해 주셨고, 가입 절차도 빠르게 진행해 주셨습니다.",
    텔러: "유다영",
    상담일시: "17:38:20"
  },
  {
    번호: "9",
    손님: "박병철",
    상담분류: "예금",
    별점: "5",
    내용: "유다영 텔러님께서 정기 예금 상품에 대해 아주 자세히 설명해 주셨고, 가입 절차도 빠르게 진행해 주셨습니다.",
    텔러: "유다영",
    상담일시: "15:12:20"
  },
  {
    번호: "8",
    손님: "이세준",
    상담분류: "연금",
    별점: "5",
    내용: "유다영 텔러님이 개인 연금에 대해 상세히 설명해 주셨고, 가입 혜택도 꼼꼼하게 안내해 주셔서 큰 도움이 되었습니다.",
    텔러: "유다영",
    상담일시: "14:15:45"
  },
  {
    번호: "7",
    손님: "유도현",
    상담분류: "적금",
    별점: "4",
    내용: "유다영 텔러님께서 적금 상품에 대해 자세히 설명해 주셨습니다. 친절하고 명확한 설명 덕분에 쉽게 이해할 수 있었습니다.",
    텔러: "유다영",
    상담일시: "14:05:30"
  },
  {
    번호: "6",
    손님: "한세진",
    상담분류: "카드",
    별점: "4",
    내용: "유다영 텔러님께 체크카드 발급 문의를 했는데, 절차를 빠르고 친절하게 안내해 주셨습니다.",
    텔러: "유다영",
    상담일시: "12:40:00"
  },
  {
    번호: "5",
    손님: "손세희",
    상담분류: "예금",
    별점: "5",
    내용: "유다영 텔러님이 예금 이자율에 대해 자세히 설명해 주셨고, 상담이 매우 만족스러웠습니다.",
    텔러: "유다영",
    상담일시: "11:25:50"
  },
  {
    번호: "4",
    손님: "김현지",
    상담분류: "연금",
    별점: "5",
    내용: "유다영 텔러님께서 퇴직 연금에 대해 상세히 안내해 주셔서 큰 도움이 되었습니다.",
    텔러: "유다영",
    상담일시: "10:10:35"
  },
  {
    번호: "3",
    손님: "이주영",
    상담분류: "적금",
    별점: "3",
    내용: "유다영 텔러님께서 적금 상품을 설명해 주셨는데, 설명이 조금 부족했습니다.",
    텔러: "유다영",
    상담일시: "09:55:20"
  },
  {
    번호: "2",
    손님: "박민지",
    상담분류: "카드",
    별점: "2",
    내용: "유다영 텔러님께 신용카드 발급 문의를 했지만, 응대가 다소 미흡했습니다.",
    텔러: "유다영",
    상담일시: "09:40:23"
  },
  {
    번호: "1",
    손님: "이수현",
    상담분류: "예금",
    별점: "5",
    내용: "유다영 텔러님께서 예금 상품에 대해 상세히 설명해 주셨고, 매우 만족스러운 상담이었습니다.",
    텔러: "유다영",
    상담일시: "09:12:00"
  }
  // Add more records as necessary
];

const records2 = [

  {
    순서: "박병철",
    상담분류: "예금",
    별점: "5",
    내용: "친절한 설명 덕분에 원하는 상품을 쉽게 가입했습니다.",
    텔러: "유다영",
    상담일시: "17:55:20"
  },
  {
    순서: "김민수",
    상담분류: "예금",
    별점: "5",
    내용: "이서진 텔러님께서 정기 예금 상품에 대해 아주 자세히 설명해 주셨고, 가입 절차도 빠르게 진행해 주셨습니다.",
    텔러: "이서진",
    상담일시: "17:45:20"
  },
  {
    순서: "이영희",
    상담분류: "카드",
    별점: "4",
    내용: "최지훈 텔러님께 신용카드 한도 증액 요청을 했습니다. 친절하게 안내해 주셔서 만족합니다.",
    텔러: "최지훈",
    상담일시: "16:30:10"
  },
  {
    순서: "박소영",
    상담분류: "연금",
    별점: "5",
    내용: "김하늘 텔러님이 개인 연금에 대해 상세히 설명해 주셨고, 가입 혜택도 꼼꼼하게 안내해 주셔서 큰 도움이 되었습니다.",
    텔러: "김하늘",
    상담일시: "15:15:45"
  },
  {
    순서: "최준영",
    상담분류: "적금",
    별점: "4",
    내용: "윤미래 텔러님께서 적금 상품에 대해 자세히 설명해 주셨습니다. 친절하고 명확한 설명 덕분에 쉽게 이해할 수 있었습니다.",
    텔러: "윤미래",
    상담일시: "14:05:30"
  },
  {
    순서: "김유진",
    상담분류: "카드",
    별점: "4",
    내용: "조영수 텔러님께 체크카드 발급 문의를 했는데, 절차를 빠르고 친절하게 안내해 주셨습니다.",
    텔러: "조영수",
    상담일시: "12:40:00"
  },
  {
    순서: "이재훈",
    상담분류: "예금",
    별점: "5",
    내용: "한지수 텔러님이 예금 이자율에 대해 자세히 설명해 주셨고, 상담이 매우 만족스러웠습니다.",
    텔러: "한지수",
    상담일시: "11:25:50"
  },
  {
    순서: "박지훈",
    상담분류: "연금",
    별점: "5",
    내용: "오민호 텔러님께서 퇴직 연금에 대해 상세히 안내해 주셔서 큰 도움이 되었습니다.",
    텔러: "오민호",
    상담일시: "10:10:35"
  },
  {
    순서: "정수민",
    상담분류: "적금",
    별점: "3",
    내용: "김도현 텔러님께서 적금 상품을 설명해 주셨는데, 설명이 조금 부족했습니다.",
    텔러: "김도현",
    상담일시: "09:55:20"
  },
  {
    순서: "최영수",
    상담분류: "카드",
    별점: "2",
    내용: "이현우 텔러님께 신용카드 발급 문의를 했지만, 응대가 다소 미흡했습니다.",
    텔러: "이현우",
    상담일시: "08:40:10"
  },
  {
    순서: "강민지",
    상담분류: "예금",
    별점: "5",
    내용: "박진우 텔러님께서 예금 상품에 대해 상세히 설명해 주셨고, 매우 만족스러운 상담이었습니다.",
    텔러: "박진우",
    상담일시: "07:25:00"
  }
];

function Workscustomer() {
  return <MainContent records={records} />;
}

function MainContent({ records }) {
  return (
    <div className="MainContent">
      <h2>업무 기록 관리</h2>
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>손님</th>
            <th>상담 분류</th>
            <th>내용</th>
            <th>텔러</th>
            <th>별점</th>
            <th>상담 일시</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              
              <td>{record.번호}</td>
              <td>{record.손님}</td>
              <td>{record.상담분류}</td>
              <td>{record.내용}</td>
              <td>{record.텔러}</td>
              <td>{record.별점}</td>
              <td>{record.상담일시}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Workscustomer;
