import React, { useState } from "react";
import "./index_teller.scss";
import Button from "@/components/Button";

function AfterTeller() {
  const [customer, setCustomer] = useState("");
  const [teller, setTeller] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <>
      <div className="AfterContainer">
        <div className="loginForm">
          <label>
            담당고객
            <input
              className="inputForm"
              type="text"
              placeholder="김서윤"
              value={customer}      
              disabled        
            />
          </label>
          <label>
            작성자
            <input
              className="inputForm"
              type="text"
              placeholder="임탁균"
              value={teller}    
              disabled          
            />
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
            <input
              className="inputForm"
              type="text"
              placeholder="내용을 입력해주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </label>
        </div>
      </div>
    </>
  );
}

export default AfterTeller;
