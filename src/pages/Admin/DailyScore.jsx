import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const DailyScore = () => {
  const options = {
    chart: {
      type: "line",
      style: {
        fontFamily: "Hana2"
      }
    },
    title: {
      text: "일 별 상담 평점 현황",
      align: "center",
      style: {
        fontSize: "30px",
        color: "#008e71",
        fontFamily: "Hana2",
        fontWeight: "bold",
        textAlign: "center",
        width: "100%"
      }
    },

    xAxis: {
      categories: [
        "6월 3일",
        "6월 4일",
        "6월 5일",
        "6월 7일",
        "6월 10일",
        "6월 11일",
        "6월 12일"
      ],
      labels: {
        style: {
          fontSize: "20px",
          color: "#008e71",
          fontFamily: "Hana2",
          fontWeight: "bold",
          textAlign: "center",
          width: "100%",
          marginBottom: "120px" // 추가된 스타일',
        }
      }
    },
    yAxis: {
      title: {
        text: "상담 평점",
        style: {
          fontFamily: "Hana2"
        }
      },
      labels: {
        style: {
          fontFamily: "Hana2"
        }
      }
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
          style: {
            fontFamily: "Hana2"
          }
        },
        enableMouseTracking: false
      }
    },
    series: [
      {
        name: "카드",
        data: [4.5, 4.27, 3.8, 4.6, 4, 3.97, 4.8]
      },
      {
        name: "적금",
        data: [4.2, 4.37, 4.8, 4.1, 4.1, 3.37, 4.5]
      },
      {
        name: "예금",
        data: [3.5, 4.57, 3.9, 4.3, 4.5, 4.27, 4.1]
      }
    ]
  };

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "120px",
      }}
    >
      <div style={{ width: "100%", margin: "0 auto" }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default DailyScore;
