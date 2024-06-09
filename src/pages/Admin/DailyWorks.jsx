import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const DailyWorks = () => {
    const options = {
        chart: {
            type: 'column'
        },
        title: {
            text: '일별 업부 현황',
            align: 'left'
        },
        xAxis: {
            categories: ['6.4', '6.5', '6.7', '6.10', '6.11', '6.12']
        },
        yAxis: {
            min: 0,
            title: {
                text: '업무별 상담 건수 '
            },
            stackLabels: {
                enabled: true
            }
        },
        legend: {
            align: 'left',
            x: 70,
            verticalAlign: 'top',
            y: 70,
            floating: true,
            backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
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
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default DailyWorks;
