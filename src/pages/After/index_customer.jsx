import React, { useState } from "react";
import { PiStarFill, PiStarLight } from "react-icons/pi";
import "./index_customer.scss";
import Button from "@/components/Button";

function AfterCustomer() {
  const [customer, setCustomer] = useState("박병철");
  const [teller, setTeller] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = (e) => {
    // '제출'버튼 눌렀을때 전송될 내용
  };

  return (
    <>
      <form className="AfterCustomerContainer">
        <div className="dummy"></div><div className="dummy"></div>
        <div className="title">{customer} 님</div>
        <div className="title">상담은 만족스러우셨나요?</div>
        <div className="dummy"></div>
        <div className="title" style={{ alignItems: "flex-start" }}>
          담당텔러: {teller}
        </div>        
        <div>
          {[...Array(rating)].map((a, i) => (
            <PiStarFill
              className="star-lg"
              key={i}
              style={{ fontSize: "30px", color: "#008e71" }}
              onClick={() => setRating(i + 1)}
            />
          ))}
          {[...Array(5 - rating)].map((a, i) => (
            <PiStarLight
              className="star-lg"
              key={i}
              style={{ fontSize: "30px" }}
              onClick={() => setRating(rating + i + 1)}
            />
          ))}
        </div>
        <div className="dummy"></div>
        <textarea
          className="textareaForm"
          placeholder="자유롭게 입력해주세요"
          value={content}
          style={{ height: "150px" }}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="dummy"></div>

        <Button type="submit" shape="rect" onClick={handleSubmit}>
          제출
        </Button>
      </form>
    </>
  );
}

export default AfterCustomer;