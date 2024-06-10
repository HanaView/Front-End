import { getUserDeposits } from "@/apis/deposit";

import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

const CustomerTask = () => {
  const { data: userDeposits } = useQuery({
    queryKey: ["getUserDeposits"],
    queryFn: () => getUserDeposits(1)
  });

  function formatDateToKST(dateString) {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Seoul"
    };
    return date
      .toLocaleDateString("ko-KR", options)
      .replace(/\./g, "-")
      .replace(/ /g, "");
  }

  return (
    <>
      <div className="wrapper">
        <div className="table">
          <div className="row header green">
            <div className="cell">상품명</div>
            <div className="cell">계좌번호</div>
            <div className="cell">종류</div>
            <div className="cell">잔액</div>
            <div className="cell">휴면상태</div>
            <div className="cell">분실 신고</div>
            <div className="cell">이체 한도</div>
            <div className="cell">생성일</div>
            <div className="cell">최종 거래일</div>
          </div>
          {userDeposits?.data?.map((product, index) => (
            <div className="row" key={index}>
              <div className="cell" data-title="상품명">
                {product.depositInfo.name}
              </div>
              <div className="cell" data-title="계좌번호">
                {product.accountNumber}
              </div>
              <div className="cell" data-title="종류">
                {product.depositInfo.depositCategoryId == 1
                  ? "입출금자유예금"
                  : "정기예금"}
              </div>
              <div className="cell" data-title="잔액">
                {product.balance.toLocaleString()}
              </div>
              <div className="cell" data-title="휴면상태">
                {product.isHuman ? "T" : "F"}
              </div>
              <div className="cell" data-title="분실 신고 상태">
                {product.isLoss ? "T" : "F"}
              </div>
              <div className="cell" data-title="이체 한도">
                {product.bounds.toLocaleString()}
              </div>
              <div className="cell" data-title="생성일">
                {formatDateToKST(product.createdAt)}
              </div>
              <div className="cell" data-title="최종 거래일">
                {formatDateToKST(product.updatedAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CustomerTask;
