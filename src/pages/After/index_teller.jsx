import React, { useState } from "react";
import "./index_teller.scss";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";
import toast, { toastConfig } from "react-simple-toasts";
import "react-simple-toasts/dist/theme/dark.css";

toastConfig({ theme: "dark" });

function AfterTeller() {
  const [customer, setCustomer] = useState("박병철");
  const [teller, setTeller] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (e) => {
    // '확인'버튼 눌렀을때 전송될 내용
    e.preventDefault();
    toast("제출 완료되었습니다.");
    navigate("/admin/tellerLog");
  };

  return (
    <>
      <form className="AfterTellerContainer">
        <div className="dummy"></div>
        <div className="title">상담 내용을 기록해주세요</div>
        <div className="dummy"></div>
        <div className="formContainer">
          <label>
            담당고객
            <input
              className="inputForm"
              type="text"
              //placeholder="박병철"
              value={customer}
              style={{ width: "30%" }}
              disabled
            />
          </label>
          <label>
            작성자
            <input
              className="inputForm"
              type="text"
              placeholder="김서윤"
              value={teller}
              style={{ width: "30%" }}
              disabled
            />
          </label>
          <label>
            업무 선택
            <select
              className="inputForm"
              value={selectedOption}
              onChange={handleChange}
            >
              <option value="">업무 선택</option>
              <option value="option1">예/적금</option>
              <option value="option2">카드</option>
              <option value="option3">대출</option>
              <option value="option4">전자금융</option>
            </select>
          </label>
          <label>
            제목
            <input
              className="inputForm"
              type="text"
              placeholder="제목을 입력해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label>
            내용
            <textarea
              className="textareaForm"
              placeholder="내용을 입력해주세요"
              value={content}
              style={{ height: "150px" }}
              onChange={(e) => setContent(e.target.value)}
            />
          </label>
        </div>

        <Button type="submit" shape="rect" onClick={handleSubmit}>
          확인
        </Button>
      </form>
    </>
  );
}

export default AfterTeller;
