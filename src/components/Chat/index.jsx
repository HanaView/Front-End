import React, { useState, useRef, useEffect } from "react";

const Chat = ({ sendMessage, messages }) => {
  const [inputMsg, setInputMsg] = useState('');
  const chatInputRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    chatInputRef.current.scrollTop = chatInputRef.current.scrollHeight;
  }, [messages]);

  const onChangeInputMsg = (event) => {
    setInputMsg(event.target.value);
  }

  const handleSendMessage = () => {
    const message = inputMsg.trim();
    if (message !== "") {
      sendMessage(message);
      setInputMsg('');
    }
  };

  return (
    <div>
      <div ref={chatInputRef} style={{ maxHeight: "200px", overflowY: "scroll" }}>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.sender}:</strong> {message.content}{" "}
            <span>{message.timestamp}</span>
          </div>
        ))}
      </div>
      <div>
        <input type="text" placeholder="메시지를 입력하세요" value={inputMsg} onChange={onChangeInputMsg} />
        <button onClick={handleSendMessage}>전송</button>
      </div>
    </div>
  );
};

export default Chat;
