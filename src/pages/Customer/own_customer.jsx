import React, { useEffect } from "react";
import "./own_customer.scss";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2"; // 원하는 차트 종류를 가져오세요.
import { useQuery } from "@tanstack/react-query";
import { getUserDeposits } from "@/apis/deposit";
import { getUserCards } from "@/apis/card";
import { getUserSavings } from "@/apis/saving";

ChartJS.register(ArcElement, Tooltip, Legend);

function OwnCustomer() {
  const { data: userDeposits } = useQuery({
    queryKey: ["getUserDeposits"],
    queryFn: () => getUserDeposits(1)
  });

  const { data: userCards } = useQuery({
    queryKey: ["getUserCards"],
    queryFn: () => getUserCards(1)
  });

  const { data: userSavings } = useQuery({
    queryKey: ["getUserSavings"],
    queryFn: () => getUserSavings(1)
  });
  const data = {
    labels: ["예금", "적금", "대출", "카드"],
    datasets: [
      {
        label: "# of Votes",
        data: [
          userDeposits?.data?.length,
          userSavings?.data?.length,
          1,
          userCards?.data?.length
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)"
        ],
        borderWidth: 2
      }
    ]
  };

  useEffect(() => {
    console.log("userDeposits", userDeposits);
    console.log("userCards", userCards);
    console.log("userSavings", userSavings);
  }, [userDeposits, userCards, userSavings]);
  if (!userCards) return <></>;

  return (
    <>
      <div className="OwnCustomerContainer">
        <div className="title">마이 자산</div>
        <div className="dummy"></div>
        <div className="contentContainer">
          <div className="pieContainer">
            <Pie data={data} />
          </div>
          <div className="dummy"></div>
          <div className="productContainer">
            <div className="first">
              <div className="productWrapper">
                <div className="productTitle">예금</div>
                <div className="product">
                  {userDeposits.data?.map((product, index) => (
                    <div key={index}>
                      <p>{product.depositInfo?.name}</p>
                      <p className="num">
                        {product?.balance.toLocaleString()}원
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="productWrapper">
                <div className="productTitle">적금</div>
                <div className="product">
                  {userSavings.data?.map((product, index) => (
                    <div key={index}>
                      <p>{product.parent?.depositInfo.name}</p>
                      <p className="num">
                        {product?.balance.toLocaleString()}원
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="productWrapper">
                <div className="productTitle">대출</div>
                <div className="product">
                  <div>
                    <p>학자금대출</p>
                    <p className="num">2,500,000원</p>
                  </div>
                </div>
              </div>
              <div className="productWrapper">
                <div className="productTitle">카드</div>
                <div className="product">
                  {userCards.data?.map((product, index) => (
                    <div key={index}>{product.cardInfo?.name}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

    //  <>
    //   <div className="wrapper ownCustomerTable">
    //     <div className="table">
    //       <div className="row header green">
    //         <div className="cell">카드상품명</div>
    //       </div>
    //        {userCards.data.map((product, index) => (
    //         <div className="row" key={index}>
    //           <div className="cell" data-title="상품명">
    //             {product.cardInfo.name}
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </>
    // <>
    //   <div className="wrapper ownCustomerTable">
    //     <div className="table">
    //       <div className="row header green">
    //         <div className="cell">예금 계좌</div>
    //       </div>
    //       {userDeposits.data.map((product, index) => (
    //         <div className="row" key={index}>
    //           <div className="cell" data-title="상품명">
    //             {product.accountNumber}
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </>
    // </div>
  );
}
export default OwnCustomer;
