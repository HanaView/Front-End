import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const DailyWorks = () => {
    const options = {
        chart: {
            type: 'column',
            style: {
                fontFamily: 'Hana2'
            }
        },
        title: {
            text: '일 별 업무 현황',
            align: 'center',
            style: {
                fontSize: '30px',
                color: '#008e71',
                fontFamily: 'Hana2',
                fontWeight: 'bold',
                textAlign: 'center',
                width: '100%',
            }
        },
        xAxis: {
            categories: ['6월 4일', '6월 5일', '6월 7일', '6월 10일', '6월 11일', '6월 12일'],
            labels: {
                style: {
                    fontSize: '20px',
                    color: '#008e71',
                    fontFamily: 'Hana2',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    width: '100%',
                    marginBottom: '120px' // 추가된 스타일',
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '업무별 상담 건수',
                style: {
                    fontFamily: 'Hana2'
                }
            },
            labels: {
                style: {
                    fontFamily: 'Hana2'
                }
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontFamily: 'Hana2'
                }
            }
        },
        legend: {
            align: 'center',
            verticalAlign: 'bottom',
            backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false,
            itemStyle: {
                fontFamily: 'Hana2'
            }
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
            style: {
                fontFamily: 'Hana2'
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    style: {
                        fontFamily: 'Hana2'
                    }
                }
            }
        },
        series: [{
            name: '카드',
            data: [12, 8, 3, 5, 11, 13]
        }, {
            name: '예금',
            data: [8, 11, 14, 8, 8, 12]
        }, {
            name: '적금',
            data: [4, 21, 10, 12, 16, 13]
        }]
    };

    return (
      <div style={{ textAlign: "center" }}>
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
            {" "}
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        </div>
      </div>
    );
};

export default DailyWorks;
