import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: false,
            text: 'City label should go here',
        },
    },
};

export const BarChart = ({aqiData}) => {

    console.info({aqiData});

    // const labels = [`Good`, `Satisfactory`, `Moderate`, `Poor`, `Very poor`, `Severe`];
    const labels = aqiData.map(cityData => cityData.city);

    const data = {
        labels,
        datasets: [
            {
                label: 'AQI',
                data: aqiData.map(cityData => cityData.aqi.toFixed(2)),
                backgroundColor: 'rgba(9,9,9,0.7)',
            }
        ],
    };

    return <Bar options={options} data={data} type={"bar"}/>;
}