import React, { useEffect } from "react";
import "./own_customer.scss";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
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
        label: "가입 상품 수",
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

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 20,
          padding: 15,
          font: {
            family: 'Hana2'
          }
        }
      },
      tooltip: {
        backgroundColor: '#008e71',
        titleColor: '#fff',
        bodyColor: '#fff',
        footerColor: '#fff',
        displayColors: false,
        bodyFont: {
          family: 'Hana2'
        },
        titleFont: {
          family: 'Hana2'
        },
        footerFont: {
          family: 'Hana2'
        }
      }
    },
    maintainAspectRatio: false,
    font: {
      family: 'Hana2'
    }
  };
  

  useEffect(() => {
    console.log("userDeposits", userDeposits);
    console.log("userCards", userCards);
    console.log("userSavings", userSavings);
  }, [userDeposits, userCards, userSavings]);

  if (!userCards) return <></>;

  return (
    <div className="own-customer-container">
      <div className="title">
        <span className="username">박병철</span> 님의 자산 현황✨
      </div>
      <div className="content-container">
        <div className="pie-container">
          <Pie data={data} options={options} />
        </div>
        <div className="product-container">
          <div className="product-wrapper">
            <div className="product-title">예금</div>
            <div className="product-list">
              {userDeposits?.data?.map((product, index) => (
                <div key={index} className="product-item">
                  <p>{product.depositInfo?.name}</p>
                  <p className="amount">{product?.balance.toLocaleString()}원</p>
                </div>
              ))}
            </div>
          </div>
          <div className="product-wrapper">
            <div className="product-title">적금</div>
            <div className="product-list">
              {userSavings?.data?.map((product, index) => (
                <div key={index} className="product-item">
                  <p>{product.parent?.depositInfo.name}</p>
                  <p className="amount">{product?.balance.toLocaleString()}원</p>
                </div>
              ))}
            </div>
          </div>
          <div className="product-wrapper">
            <div className="product-title">대출</div>
            <div className="product-list">
              <div className="product-item">
                <p>학자금대출</p>
                <p className="amount">2,500,000원</p>
              </div>
            </div>
          </div>
          <div className="product-wrapper">
            <div className="product-title">카드</div>
            <div className="product-list">
              {userCards?.data?.map((product, index) => (
                <div key={index} className="product-item">
                  <p>{product.cardInfo?.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnCustomer;
