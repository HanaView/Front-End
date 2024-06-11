import React, { useState, useEffect } from "react";
import Button from "../Button";
import "./style.scss";
import {
  accountPwAtom,
  agreementModalAtom,
  agreementOkAtom,
  globalModalAtom,
  messageModalAtom,
  socketAtom
} from "@/stores";
import { useAtom, useSetAtom } from "jotai";
import { closeModal } from "../Modal";
import { getUserDeposits } from "@/apis/deposit";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postJoinCard } from "@/apis/card";
import AddressInput from "../Input/AddressInput";
import toast, { toastConfig } from "react-simple-toasts";
import "react-simple-toasts/dist/theme/dark.css";
toastConfig({ theme: "dark" });

const CardForm = ({ product, onBack }) => {
  const queryClient = useQueryClient();
  const [account, setAccount] = useState("");
  const [accountInfo, setAccountInfo] = useState("");
  const [modalData, setModalData] = useAtom(globalModalAtom);
  const [disableJoin, setDisableJoin] = useState(true);

  // 주소 상태값
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  // 출금일 상태값
  const [withdrawalDay, setWithdrawalDay] = useState("");
  // 계좌 비밀번호
  const [password] = useAtom(accountPwAtom);
  // 동의서 확인
  const [agreementSent, setAgreementSent] = useAtom(agreementOkAtom);

  const { data: userDeposits } = useQuery({
    queryKey: ["getUserDeposits"],
    queryFn: () => getUserDeposits(1)
  });

  const postJoinMutation = useMutation({
    mutationFn: () =>
      postJoinCard(product.id, {
        userId: 1,
        userDepositId: account,
        password: password
      }),
    onSuccess: (data) => {
      console.log("Join successful:", data);
      closeModal(setModalData);
      toast("가입되었습니다.");

      // @ts-ignore
      queryClient.invalidateQueries(["userCards"]);
    },
    onError: (error) => {
      console.error("Join failed:", error);
    }
  });

  const handleAccountChange = (e) => {
    const name = e.target.options[e.target.selectedIndex].text;
    setAccountInfo(name);
    setAccount(e.target.value);
  };

  const handleJoinDeposit = () => {
    postJoinMutation.mutate();
  };

  const handleJoin = () => {
    setModalData((prevState) => ({
      ...prevState,
      isOpen: true,
      confirmButtonText: "가입",
      children: <JoinModalContent />,
      onClickConfirm: () => {
        handleJoinDeposit();
      }
    }));
  };

  const [signalingSocket] = useAtom(socketAtom);

  const setAgreementModalData = useSetAtom(agreementModalAtom);
  const [messageModalData, setMessageModalData] = useAtom(messageModalAtom); // jotai를 사용한 상태 관리

  // 동의서 버튼 클릭
  const handleAgreementButtonClick = () => {
    console.log("ㅎㅎㅎ즐거운코딩");
    console.log("@@@ signalingSocket", signalingSocket);

    // WebSocket 메시지 전송
    if (signalingSocket && signalingSocket.readyState === WebSocket.OPEN) {
      setMessageModalData({
        isOpen: true,
        children: null,
        content: (
          <div id="modalDiv">
            <div id="modalContent">
              <p id="modalInfo">동의서 작성 화면을 띄웠습니다!</p>
            </div>
          </div>
        ),
        confirmButtonText: "확인", // 확인 누르고 customer로 이동
        onClickConfirm: () => {
          // Close the modal
          closeModal(setMessageModalData);
          setTimeout(() => {
            setMessageModalData({
              isOpen: true,
              children: null,
              content: (
                <div id="modalDiv">
                  <div id="modalContent">
                    <p id="modalInfo">동의서 작성이 완료되었습니다.</p>
                  </div>
                </div>
              ),
              confirmButtonText: "확인",
              onClickConfirm: () => {
                // Close the modal
                closeModal(setMessageModalData);
                setAgreementSent(true); // 동의서 전송 여부 업데이트
              }
            });
          }, 3000);
        }
      });

      console.log("Sending SHOW_AGREEMENT_MODAL message");
      signalingSocket.send(JSON.stringify({ type: "SHOW_AGREEMENT_MODAL" }));
    }
  };

  // 비밀번호 입력 요청 버튼 클릭
  const handleRequirePasswordButtonClick = () => {
    console.log("@@@ signalingSocket", signalingSocket);

    if (signalingSocket && signalingSocket.readyState === WebSocket.OPEN) {
      setMessageModalData({
        isOpen: true,
        children: null,
        content: (
          <div id="modalDiv">
            <div id="modalContent">
              <p id="modalInfo">비밀번호 입력 화면을 띄웠습니다.</p>
            </div>
          </div>
        ),
        confirmButtonText: "확인",
        onClickConfirm: () => {
          // Close the modal
          setMessageModalData({
            isOpen: false,
            children: null,
            content: null,
            confirmButtonText: "",
            onClickConfirm: null
          });
        }
      });

      signalingSocket.send(
        JSON.stringify({
          type: "show_pwInputModal"
        })
      );
    }
  };

  const InfoItem = ({ label, value }) => (
    <div className="info">
      <div className="label">{label} : </div>
      <span>{value}</span>
    </div>
  );

  const JoinModalContent = () => {
    return (
      <div className="joinModal">
        <div className="joinModalContainer">
          <InfoItem label="상품정보" value={product.name} />
          <InfoItem label="출금계좌" value={accountInfo || "X"} />
          <InfoItem label="출금일" value={withdrawalDay + " 일" || "X"} />
          <InfoItem label="주소" value={address} />
          <InfoItem label="상세 주소" value={detailAddress} />
          <InfoItem label="비밀번호 인증 여부" value={password ? "O" : "X"} />
          <InfoItem
            label="동의서 전송 여부"
            value={agreementSent ? "O" : "X"}
          />
          <div className="joinMessage">
            <span>🥰 가입 정보를 확인 후 손님께 안내해주세요 🥰</span>
          </div>
        </div>
      </div>
    );
  };

  
  //가입버튼 비활성화
  useEffect(() => {
    const isDisable = !account || !withdrawalDay || !password || ! agreementSent
    setDisableJoin(isDisable);
  }, [account, withdrawalDay,  password, agreementSent]);

  return (
    <div className="joinFormWrapper">
      <div className="joinForm">
        <div className="backButtonWrapper">
          <button onClick={onBack} className="backBtn" />
          <h2 className="title">카드</h2>
        </div>
        <div className="depositInfo column">
          <div className="name">
            <p className="lableBox">상품정보:</p>
            <span>{product.name}</span>
          </div>
        </div>
        <div className="column account">
          <div className="accountList">
            <label htmlFor="accountSelect" className="lableBox">
              출금계좌:
            </label>
            <select
              id="accountSelect"
              value={account}
              onChange={handleAccountChange}
            >
              <option value="">계좌를 선택하세요</option>
              {userDeposits?.data
                .filter((item) => !item.isLoss && !item.isHuman)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.accountNumber} - {item.depositInfo.name}
                  </option>
                ))}
            </select>
          </div>
          <Button size="medium" onClick={handleRequirePasswordButtonClick}>
            비밀번호 입력 요청
          </Button>
        </div>
        <div className="depositInfo principal">
          <div className="accountList address">
            <p className="lableBox">출금일:</p>
            <select
              id="withdrawalDaySelect"
              value={withdrawalDay}
              onChange={(e) => setWithdrawalDay(e.target.value)}
            >
              <option value="">출금일을 선택하세요</option>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  {day}일
                </option>
              ))}
            </select>
          </div>

          <Button size="medium" onClick={handleAgreementButtonClick}>
            동의서 전송
          </Button>
        </div>
        <div className="depositInfo">
          <div className="accountList address">
            <p className="lableBox">주소:</p>
            <div className="box">
              <div className="boxContent">
                <AddressInput
                  postcode={postcode}
                  setPostcode={setPostcode}
                  address={address}
                  setAddress={setAddress}
                  detailAddress={detailAddress}
                  setDetailAddress={setDetailAddress}
                />
              </div>
            </div>
          </div>
          <div>
            <Button size="medium" onClick={handleJoin} disabled={disableJoin}>
              가입 진행
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardForm;
