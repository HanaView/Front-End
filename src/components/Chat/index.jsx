import React, { useState, useEffect, useRef } from "react";
import "./style.scss";

const Chat = ({ onSendMessage, messages }) => {
  const [inputMsg, setInputMsg] = useState("");
  const chatContainerRef = useRef(null);

  const onChangeInputMsg = (event) => {
    setInputMsg(event.target.value);
  };

  const handleSendChatMessage = () => {
    if (inputMsg) {
      onSendMessage(inputMsg);
      setInputMsg("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendChatMessage();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div id="chatDiv">
      <div id="chatContainer" ref={chatContainerRef}>
        {messages && messages.map((msg, index) => (
          <div key={index}>
            {msg.sender}: {msg.message}
          </div>
        ))}
      </div>
      <div id="chatInputContainer">
        <input
          type="text"
          id="chatInput"
          placeholder="메시지를 입력하세요"
          value={inputMsg}
          onChange={onChangeInputMsg}
          onKeyPress={handleKeyPress} // 엔터 키 감지
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
