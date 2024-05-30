import React, { useState, useEffect } from "react";
import "./style.scss";

function Chat() {
    // const [dataChannel, setDataChannel] = useState(null);
    // const [inputMsg, setInputMsg] = useState('');
    // const [remoteDescription, setRemoteDescription] = useState(null); // 가상의 신호 서버를 통한 리모트 SDP 저장
    // const configuration = {
    //     iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    // };
    // const peerConnection = new RTCPeerConnection(configuration);

    // useEffect(() => {
    //     const channel = peerConnection.createDataChannel('chat');
    //     setDataChannel(channel);

    //     channel.onopen = () => {
    //         console.log('데이터 채널이 열렸습니다.');
    //     };
    //     channel.onmessage = (event) => {
    //         console.log('받은 메시지:', event.data);
    //         displayChatMessage('Remote', event.data);
    //     };

    //     peerConnection.onicecandidate = (event) => {
    //         if (event.candidate) {
    //             console.log('ICE Candidate:', event.candidate);
    //             // ICE 후보를 원격 피어에 전달해야 함
    //             // 예: 신호 서버에 ICE 후보 전달
    //         }
    //     };

    //     peerConnection.createOffer()
    //         .then((offer) => {
    //             return peerConnection.setLocalDescription(offer);
    //         })
    //         .then(() => {
    //             console.log('SDP Offer:', peerConnection.localDescription);
    //             // SDP Offer를 원격 피어에 전달해야 함
    //             // 예: 신호 서버에 SDP Offer 전달
    //         })
    //         .catch((error) => console.error(error));

    //     // 가상의 신호 서버로부터 SDP 답변 받는 코드
    //     // 예: setRemoteDescription(receivedAnswer);

    //     if (remoteDescription) {
    //         peerConnection.setRemoteDescription(remoteDescription)
    //             .then(() => {
    //                 console.log('리모트 SDP 설정 완료');
    //             })
    //             .catch((error) => console.error(error));
    //     }
    // }, [remoteDescription]);

    // const onChangeInputMsg = (event) => {
    //     setInputMsg(event.target.value);
    // }

    // const sendChatMessage = () => {
    //     if (inputMsg && dataChannel && dataChannel.readyState === 'open') {
    //         dataChannel.send(inputMsg);
    //         displayChatMessage('텔러', inputMsg);
    //         setInputMsg('');
    //     }
    // }

    // const displayChatMessage = (sender, message) => {
    //     const chatContainer = document.getElementById('chatContainer');
    //     const messageElement = document.createElement('div');
    //     messageElement.textContent = `${sender}: ${message}`;
    //     chatContainer.appendChild(messageElement);
    //     chatContainer.scrollTop = chatContainer.scrollHeight;
    // }

    return (
        <div id="chatDiv">
            <div id="chatContainer"></div>
            <div id="chatInputContainer">
                <input type="text" id="chatInput" placeholder="메시지를 입력하세요" value={inputMsg} onChange={onChangeInputMsg} />
                <img
                    className="callBtn"
                    src="/src/assets/images/sendChat.png"
                    onClick={sendChatMessage}
                    alt="Send"
                />
            </div>
        </div>
    );
}

export default Chat;
