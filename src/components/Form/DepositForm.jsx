import React, { useState, useEffect } from "react";
import Button from "../Button";
import "./style.scss";
import {
  globalModalAtom,
  messageModalAtom,
  agreementModalAtom,
  socketAtom,
  accountPwAtom,
  agreementOkAtom,
} from "@/stores";
import { useAtom, useSetAtom } from "jotai";
import { closeModal } from "../Modal";
import { getUserDeposits, postJoin } from "@/apis/deposit";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const DepositForm = ({ product, onBack }) => {
  const queryClient = useQueryClient();
  //예금 연결계좌
  const [account, setAccount] = useState("");
  //가입진행 모달에 보여줄 계좌정보
  const [accountInfo, setAccountInfo] = useState("");
  const [months, setMonths] = useState(6);
  //예상 적용 이자율
  const [interestRate, setInterestRate] = useState(
    product.depositRates[0].rate
  );
  //6개월 12개월 이자율
  const interestRate6Months = product.depositRates[0].rate;
  const interestRate12Months = product.depositRates[1].rate;

  //예상 이자
  const [interest, setInterest] = useState(0);
  //원금
  const [principal, setPrincipal] = useState("");
  //가입진행 모달
  const [modalData, setModalData] = useAtom(globalModalAtom); // 모달

  //가입 버튼 비활성화
  const [disableJoin, setDisableJoin] = useState(true);

  // 계좌 비밀번호
  const [password] = useAtom(accountPwAtom);
  // 동의서 확인
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
        //TODO: 실제 비번 받았으니 -> atom에서 불러와서 넣기 
        password: password,
        userDepositId2: account
      }),
    onSuccess: (data) => {
      // 성공 시에 실행할 코드
      console.log("Join successful:", data);
      closeModal(setModalData);
      // 예: 데이터를 최신화하기 위해 쿼리 무효화
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

  //가입 모달 관련
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
          <InfoItem label="가입액" value={principal} />
          <InfoItem label="가입 기간" value={months} />
          <InfoItem label="비밀번호 인증 여부" value={password ? "O" : "X"} />
          <InfoItem label="동의서 전송 여부" value={agreementSent ? "O" : "X"} />
          <div className="message">
            <span>🥰 가입 정보를 확인 후 손님께 안내해주세요 🥰</span>
          </div>
        </div>
      </div>
    );
  };

  //원금에 이자 예상금액
  useEffect(() => {
    const principalNum = Number(principal.replace(/,/g, ""));
    const calculatedInterest = (
      principalNum *
      (interestRate / 100) *
      (months / 12)
    ).toFixed(0);
    setInterest(Number(calculatedInterest));
  }, [principal, interestRate, months]);

  //가입버튼 비활성화
  useEffect(() => {
    const isDisable = !principal;
    setDisableJoin(isDisable);
  }, [principal, account]);

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
