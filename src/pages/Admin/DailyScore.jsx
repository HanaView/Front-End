import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const DailyScore = () => {
    const options = {
        chart: {
            type: 'line'
        },
        title: {
            text: '일 별 평점 현황'
        },
        subtitle: {
            text: 'Source: ' +
                '<a href="https://en.wikipedia.org/wiki/List_of_cities_by_average_temperature" ' +
                'target="_blank">Wikipedia.com</a>'
        },
        xAxis: {
            categories: [
                '6/3', '6/4', '6/5', '6/7', '6/10', '6/11', '6/12'
            ]
        },
        yAxis: {
            title: {
                text: '점(score)'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: '카드',
            data: [
                4.5, 4.27, 3.8, 4.6, 4, 3.97, 4.8
            ]
        }, {
            name: '적금',
            data: [
                4.2, 4.37, 4.8, 4.1, 4.1, 3.37, 4.5
            ]
        }, {
            name: '예금',
            data: [
                3.5, 4.57, 3.9, 4.3, 4.5, 4.27, 4.1
            ]
        }]
    };

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default DailyScore;
