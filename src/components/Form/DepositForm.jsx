import React, { useState, useEffect } from "react";
import Button from "../Button";
import "./style.scss";
import {
  globalModalAtom,
  messageModalAtom,
  agreementModalAtom,
  socketAtom,
  accountPwAtom,
  agreementOkAtom
} from "@/stores";
import { useAtom, useSetAtom } from "jotai";
import { closeModal } from "../Modal";
import { getUserDeposits, postJoin } from "@/apis/deposit";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast, { toastConfig } from "react-simple-toasts";
import "react-simple-toasts/dist/theme/dark.css";

toastConfig({ theme: "dark" });

const DepositForm = ({ product, onBack }) => {
  const queryClient = useQueryClient();
  const [account, setAccount] = useState("");
  const [accountInfo, setAccountInfo] = useState("");
  const [months, setMonths] = useState(6);
  const [interestRate, setInterestRate] = useState(
    product.depositRates[0].rate
  );
  const interestRate6Months = product.depositRates[0].rate;
  const interestRate12Months = product.depositRates[1].rate;
  const [interest, setInterest] = useState(0);
  const [principal, setPrincipal] = useState("");
  const [modalData, setModalData] = useAtom(globalModalAtom);
  const [disableJoin, setDisableJoin] = useState(true);
  const [password] = useAtom(accountPwAtom);
  const [agreementSent, setAgreementSent] = useAtom(agreementOkAtom);

  const {
    data: userDeposits,
    isLoading,
    error
  } = useQuery({
    queryKey: ["getUserDeposits"],
    queryFn: () => getUserDeposits(1)
  });

  const postJoinMutation = useMutation({
    mutationFn: () =>
      postJoin(product.id, {
        userId: 1,
        // @ts-ignore
        balance: Number(principal.replaceAll(",", "")),
        period: months,
        password: password,
        userDepositId2: account
      }),
    onSuccess: (data) => {
      console.log("Join successful:", data);
      closeModal(setModalData);
      toast("가입되었습니다.");
      // @ts-ignore
      queryClient.invalidateQueries(["deposits"]);
    },
    onError: (error) => {
      console.error("Join failed:", error);
    }
  });

  const changeEnteredNum = (e) => {
    let value = e.target.value;
    value = value.replace(/[^\d.-]/g, "");
    if (!isNaN(value)) {
      const removedCommaValue = Number(value.replaceAll(",", ""));
      setPrincipal(removedCommaValue.toLocaleString());
    }
  };

  const handleAccountChange = (e) => {
    const name = e.target.options[e.target.selectedIndex].text;
    setAccountInfo(name);
    setAccount(e.target.value);
  };

  const handleMonthsChange = (e) => {
    let value = parseInt(e.target.value, 10);
    // @ts-ignore
    if (isNaN(value) || value === "") {
      value = null;
    } else if (value > 36) {
      value = 36;
    }
    if (value < 12) {
      setInterestRate(interestRate6Months);
    } else {
      setInterestRate(interestRate12Months);
    }
    setMonths(value);
  };

  const handleJoinDeposit = () => {
    postJoinMutation.mutate();
  };

  const handleJoin = () => {
    console.log("Handling join...");
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

  const [signalingSocket, setSignalingSocket] = useAtom(socketAtom);

  const setAgreementModalData = useSetAtom(agreementModalAtom);
  const [messageModalData, setMessageModalData] = useAtom(messageModalAtom);

  const reconnectSocket = () => {
    const newSocket = new WebSocket("wss://dan-sup.com/rtc/WebRTC/signaling");
    newSocket.onopen = () => {
      console.log("Reconnected to the socket");
      setSignalingSocket(newSocket);
      showAgreementModal();
    };
    newSocket.onerror = (error) => {
      console.error("Socket error:", error);
    };
  };

  const showAgreementModal = () => {
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
      confirmButtonText: "확인",
      onClickConfirm: () => {
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
              closeModal(setMessageModalData);
              setAgreementSent(true);
            }
          });
        }, 3000);
      }
    });

    console.log("Sending SHOW_AGREEMENT_MODAL message");
    signalingSocket.send(JSON.stringify({ type: "SHOW_AGREEMENT_MODAL" }));
  };

  const handleAgreementButtonClick = () => {
    if (signalingSocket && signalingSocket.readyState === WebSocket.OPEN) {
      showAgreementModal();
    } else {
      reconnectSocket();
    }
  };

  const showPasswordModal = () => {
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
        setAgreementSent(true);
        closeModal(setMessageModalData);
      }
    });

    signalingSocket.send(
      JSON.stringify({
        type: "show_pwInputModal"
      })
    );
  };

  const handleRequirePasswordButtonClick = () => {
    console.log("Handling require password button click...");

    if (signalingSocket && signalingSocket.readyState === WebSocket.OPEN) {
      showPasswordModal();
    } else {
      reconnectSocket();
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
          <InfoItem label="가입액" value={principal + " 원"} />
          <InfoItem label="가입 기간" value={months + " 개월"} />
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

  useEffect(() => {
    const principalNum = Number(principal.replace(/,/g, ""));
    const calculatedInterest = (
      principalNum *
      (interestRate / 100) *
      (months / 12)
    ).toFixed(0);
    setInterest(Number(calculatedInterest));
  }, [principal, interestRate, months]);

  useEffect(() => {
    const isDisable = !principal || !account || !password || !agreementSent;
    setDisableJoin(isDisable);
  }, [principal, account, password, agreementSent]);

  return (
    <div className="joinFormWrapper">
      <div className="joinForm">
        <div className="backButtonWrapper">
          <button onClick={onBack} className="backBtn" />
          <h2 className="title">예금</h2>
        </div>
        <div className="depositInfo column">
          <div className="name">
            <p className="lableBox">상품정보:</p>
            <span>{product.name}</span>
          </div>

          <div className="rateBox">
            6개월: <span>{interestRate6Months}</span>% 12개월:
            <span>{interestRate12Months}</span>% (세전)
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
        <div className="column">
          <label className="month">
            <input
              id="monthInput"
              type="number"
              value={months}
              onChange={handleMonthsChange}
            />
            <p>개월</p>
            <div className="interestRate">
              <p>예상 적용 이자율: </p>
              <span> {interestRate}</span>%
            </div>
          </label>
        </div>
        <div className="depositInfo principal">
          <div className="box">
            <div className="boxContent">
              원금:
              <input
                className="num padding"
                type="text"
                value={principal}
                onChange={changeEnteredNum}
              ></input>
              원
            </div>
          </div>
          <Button size="medium" onClick={handleAgreementButtonClick}>
            동의서 전송
          </Button>
        </div>
        <div className="depositInfo">
          <div className="box">
            <div className="boxContent">
              이자:
              <div className="num padding">
                {Number(interest).toLocaleString()}
              </div>
              원
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

export default DepositForm;
