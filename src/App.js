import './App.css';
import {useEffect, useState} from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://city-ws.herokuapp.com/');
const AirQualityStandards = [
    {min: 0, max: 50, label: `Good`, id: `good`},
    {min: 51, max: 100, label: `Satisfactory`, id: `satisfactory`},
    {min: 101, max: 200, label: `Moderate`, id: `moderate`},
    {min: 201, max: 300, label: `Poor`, class: `poor`},
    {min: 301, max: 400, label: `Very poor`, id: `veryPoor`},
    {min: 401, max: 500, label: `Severe`, id: `severe`},
];

function App() {
    const [airQualityData, setAirQualityData] = useState([
        {
            "city": "Bengaluru",
            "aqi": 190.2365647798493
        },
        {
            "city": "Kolkata",
            "aqi": 198.30634136715327
        },
        {
            "city": "Bhubaneswar",
            "aqi": 102.418702554796
        },
        {
            "city": "Chennai",
            "aqi": 143.17230851168108
        },
        {
            "city": "Pune",
            "aqi": 219.81806791678665
        },
        {
            "city": "Hyderabad",
            "aqi": 200.3927829018787
        },
        {
            "city": "Indore",
            "aqi": 51.054989335676645
        },
        {
            "city": "Jaipur",
            "aqi": 141.5774127159125
        },
        {
            "city": "Chandigarh",
            "aqi": 48.23620326884353
        }
    ]); // default to start with

    useEffect(() => {
        /*client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        client.onmessage = (message) => {
            let liveAqiData = JSON.parse(message.data);
            // console.info({liveAqiData})
            setAirQualityData(liveAqiData);
        };*/
    },[]);

    const getSeverityClassName = (aqi) => {
        const defaultClass = `unknown`;
        const matchedStandard = AirQualityStandards.filter(standard => aqi >= standard.min && aqi <= standard.max);
        let severityStyle = `bg-indigo-300 text-white border-indigo`;
        if (!matchedStandard.length) return defaultClass;
        switch (matchedStandard[0].id){
            case `good`:
                return `bg-green-100 text-green-900 border-green-100`;
            case `satisfactory`:
                return `bg-green-300 text-green-900 border-green-300`;
            case `moderate`:
                return `bg-green-300 text-green-900 border-green-300`;
            case `poor`:
                return `bg-green-300 text-green-900 border-green-300`;
            case `veryPoor`:
                return `bg-green-300 text-green-900 border-green-300`;
            case `severe`:
                return `bg-green-300 text-green-900 border-green-300`;
            default:
                return severityStyle;
        }
    }

    return (
        <div className="container">
            <h1 className="text-3xl font-bold font-bold text-center p-4">Air Quality Checker</h1>
            <table className="table-auto justify-center m-auto">
                <thead>
                <tr>
                    <th className="text-center font-bold p-2 bg-indigo-700 text-white border-indigo-900 border-solid border-2">City</th>
                    <th className="text-center font-bold p-2 bg-indigo-700 text-white border-indigo-900 border-solid border-2">Current AQI</th>
                    <th className="text-center font-bold p-2 bg-indigo-700 text-white border-indigo-900 border-solid border-2">Last Updated</th>
                </tr>
                </thead>
                <tbody>
                {airQualityData.map(({city, aqi}) => {
                    return (<tr key={city}>
                        <td className=" text-center p-2 bg-indigo-300 text-white border-indigo-800 border-solid border-2">{city}</td>
                        <td className={` text-center p-2 bg-indigo-300 text-white border-indigo-800 border-solid border-2 ${getSeverityClassName(aqi)}`}>{aqi.toFixed(2)}</td>
                        <td className=" text-center p-2 bg-indigo-300 text-white border-indigo-800 border-solid border-2">A few minute(s) ago</td>
                    </tr>);
                })}

                </tbody>
            </table>
        </div>

    );
}

export default App;
