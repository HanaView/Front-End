import React, { useState, useEffect } from "react";
import "./style.scss";

function Chat() {
    const [message, setMessage] = useState(""); // 입력된 메시지 상태
    let socket;

    useEffect(() => {
        // WebSocket 연결
        socket = new WebSocket('ws://localhost:8080/WebRTC/signaling');

        // 메시지 수신 처리
        socket.onmessage = (event) => {
            // 받은 메시지 처리
            console.log('Received message:', event.data);
        };

        // 컴포넌트 언마운트 시 연결 종료
        return () => {
            socket.close();
        };
    }, []);

    // 메시지 전송 함수
    const sendMessage = () => {
        // 입력된 메시지가 비어있지 않으면 WebSocket을 통해 서버로 메시지 전송
        if (message.trim() !== "") {
            socket.send(message);
            setMessage(""); // 메시지 입력란 비우기
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
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                />
                <img
                    className="callBtn"
                    src="/src/assets/images/sendChat.png"
                    onClick={sendMessage} 
                    alt="Send"
                />
            </div>
        </div>
    );
}

export default Chat;