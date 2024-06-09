import React from "react";
import "./own_customer.scss";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2"; // 원하는 차트 종류를 가져오세요.
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ["예금", "적금", "대출", "카드"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5],
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

function OwnCustomer() {
  return (
    <>
      <div className="OwnCustomerContainer">
        <div className="title">마이 자산</div>
        <div className="dummy"></div>
        <div className="contentContainer">
          <div className="pieContainer">
            <Pie style={{ width: "400px", height: "400px" }} data={data} />
          </div>
          <div className="rightContainer">
            <div>가입한 예금상품: </div>
            <div>가입한 적금상품: </div>
            <div>가입한 카드: </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default OwnCustomer;
