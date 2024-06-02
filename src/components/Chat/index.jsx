import React, { useState } from "react";
import "./style.scss";

const Chat = ({ onSendMessage }) => {
  const [inputMsg, setInputMsg] = useState("");

  const onChangeInputMsg = (event) => {
    setInputMsg(event.target.value);
  };

  const handleSendChatMessage = () => {
    if (inputMsg) {
      onSendMessage(inputMsg);
      setInputMsg("");
    }
  };

  return (
    <div id="chatDiv">
      <div id="chatContainer"></div>
      <div id="chatInputContainer">
        <input
          type="text"
          id="chatInput"
          placeholder="메시지를 입력하세요"
          value={inputMsg}
          onChange={onChangeInputMsg}
        />
        <img
          className="callBtn"
          src="/src/assets/images/sendChat.png"
          onClick={handleSendChatMessage}
          alt="Send"
        />
      </div>
    </div>
  );
};

export default Chat;
