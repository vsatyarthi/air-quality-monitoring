import './App.css';
import {useEffect, useState} from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://city-ws.herokuapp.com/');
const AirQualityStandards = [
    {min: 0, max: 50, label: `Good`, id: `good`},
    {min: 51, max: 100, label: `Satisfactory`, id: `satisfactory`},
    {min: 101, max: 200, label: `Moderate`, id: `moderate`},
    {min: 201, max: 300, label: `Poor`, id: `poor`},
    {min: 301, max: 400, label: `Very poor`, id: `veryPoor`},
    {min: 401, max: 500, label: `Severe`, id: `severe`},
];

function App() {
    const [airQualityData, setAirQualityData] = useState([
        {
            "city": "Bengaluru",
            "aqi": 15.00
        },
        {
            "city": "Hyderabad",
            "aqi": 51
        },
        {
            "city": "Kolkata",
            "aqi": 201
        },
        {
            "city": "Bhubaneswar",
            "aqi": 301
        },
        {
            "city": "Chennai",
            "aqi": 401
        },
        {
            "city": "Pune",
            "aqi": 501
        },
    ]); // default to start with

    useEffect(() => {
        /*client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        client.onmessage = (message) => {
            let liveAqiData = JSON.parse(message.data);
            // TODO: since sent time is not here, need to add timestamp to show `last updated at`
            // console.info({liveAqiData})
            setAirQualityData(liveAqiData);
        };*/
    },[]);

    const getSeverityClassName = (aqi) => {
        const defaultSeverity = `bg-red-600 text-black-900 border-red-600`;
        const matchedStandard = AirQualityStandards.filter(standard => aqi >= standard.min && aqi <= standard.max);
        const id = (matchedStandard.length) ? matchedStandard[0].id : `severe`;
        console.info({id});
        switch (id){
            case `good`:
                return `bg-green-500 text-black-900 border-green-500 ${id}`;
            case `satisfactory`:
                return `bg-green-400 text-black-900 border-green-400 ${id}`;
            case `moderate`:
                return `bg-yellow-100 text-black-900 border-yellow-100 ${id}`;
            case `poor`:
                return `bg-yellow-300 text-black-900 border-yellow-300 ${id}`;
            case `veryPoor`:
                return `bg-red-400 text-black-900 border-red-400 ${id}`;
            case `severe`:
                return defaultSeverity;
            default:
                return defaultSeverity;
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
                        <td className={` text-center p-2 ${getSeverityClassName(aqi)}`}>{aqi.toFixed(2)}</td>
                        <td className=" text-center p-2 bg-indigo-300 text-white border-indigo-800 border-solid border-2">A few minute(s) ago</td>
                    </tr>);
                })}

                </tbody>
            </table>
        </div>

    );
}

export default App;
