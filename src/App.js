import './App.css';
import {useEffect, useState} from "react";
import {w3cwebsocket as W3CWebSocket} from "websocket";
import moment from 'moment';
import {BarChart} from "./components/BarChart";

const client = new W3CWebSocket('ws://city-ws.herokuapp.com/');
const historyLimit = 10;
const AirQualityStandards = [
    {min: 0, max: 50, label: `Good`, id: `good`},
    {min: 51, max: 100, label: `Satisfactory`, id: `satisfactory`},
    {min: 101, max: 200, label: `Moderate`, id: `moderate`},
    {min: 201, max: 300, label: `Poor`, id: `poor`},
    {min: 301, max: 400, label: `Very poor`, id: `veryPoor`},
    {min: 401, max: 500, label: `Severe`, id: `severe`},
];

function App() {
    const [currentCityId, setCurrentCityId] = useState(0);
    const [airQualityData, setAirQualityData] = useState([
        {
            "id": "bengaluru",
            "city": "Bengaluru",
            "aqi": 15.00,
            "timestamp": 1642330361369,
            "history": [
                {aqi: 40, receivedAt: 1642330361369},
                {aqi: 60, receivedAt: 1642330361380},
                {aqi: 101, receivedAt: 1642330361700},
                {aqi: 250, receivedAt: 1642330361800},
                {aqi: 360, receivedAt: 1642330362000},
            ],
        },
        {
            "id": "hyderabad",
            "city": "Hyderabad",
            "aqi": 51,
            "timestamp": 1642330834559,
            "history": [
                {aqi: 40, receivedAt: 1642330361369},
                {aqi: 60, receivedAt: 1642330361380},
                {aqi: 101, receivedAt: 1642330361700},
                {aqi: 250, receivedAt: 1642330361800},
                {aqi: 360, receivedAt: 1642330362000},
            ],
        },
    ]); // default to start with

    useEffect(() => {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        const receivedCityIDs = [];
        client.onmessage = (message) => {
            const receivedAqiData = JSON.parse(message.data);
            const liveAqiData = receivedAqiData.map(cityData => {
                const existingCityIndex = airQualityData.findIndex(city => city.city === cityData.city);
                const receivedAt = Date.now();
                const newVariant = {aqi: cityData.aqi, receivedAt};
                const id = cityData.city.toLowerCase().replace(' ', '');
                receivedCityIDs.push(id);
                let history;
                if (existingCityIndex > -1) {
                    if (airQualityData[existingCityIndex].history.length > historyLimit) airQualityData[existingCityIndex].history.splice(0, 1);
                    history = [...airQualityData[existingCityIndex].history, newVariant];
                } else {
                    history = [newVariant];
                }
                return {
                    ...cityData,
                    id,
                    receivedAt: receivedAt,
                    history,
                };
            });
            const filteredAqiData = airQualityData.filter(cityData => !receivedCityIDs.includes(cityData.id));
            // console.info({receivedCityIDs, airQualityData, filteredAqiData})
            const updateAqiData = [...filteredAqiData, ...liveAqiData].sort((cityA, cityB) => cityA.city.localeCompare(cityB.city));
            setAirQualityData(updateAqiData);
            // client.close();
        };
    }, [airQualityData]);

    const getElapsedTime = timeStamp => {
        return moment(timeStamp).fromNow();
    }

    const getSeverityClassName = (aqi) => {
        const defaultSeverity = `bg-red-600 text-black-900 border-red-600`;
        const matchedStandard = AirQualityStandards.filter(standard => Math.ceil(aqi) >= standard.min && Math.ceil(aqi) <= standard.max);
        const id = (matchedStandard.length) ? matchedStandard[0].id : `severe`;
        // console.info({matchedStandard, id, aqi});
        switch (id) {
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

    const showSingleCity = (id) => {
        setCurrentCityId(id);
    }

    const currentCityData = airQualityData.filter(cityData => cityData.id === currentCityId)?.[0];
    return (
        <div className="bg-neutral-100 w-screen h-screen">
            <h1 className="text-3xl font-bold font-bold text-center p-4">Air Quality Checker</h1>
            <div className="flex mr-4">
                <div className="flex w-96">
                    <table className="table-auto justify-center m-auto">
                        <thead>
                        <tr>
                            <th className="text-center font-normal p-1 bg-neutral-500 text-white border-indigo-900 border-solid border-2">City</th>
                            <th className="text-center font-normal p-1 bg-neutral-500 text-white border-indigo-900 border-solid border-2">AQI</th>
                            <th className="text-center font-normal p-1 bg-neutral-500 text-white border-indigo-900 border-solid border-2">Last
                                Updated
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {airQualityData.map(({id, city, aqi, timestamp}) => {
                            // console.info({airQualityData});
                            return (<tr key={city} onClick={() => showSingleCity(id)}
                                        className={`text-center p-1 ${getSeverityClassName(aqi)}} cursor-pointer hover:border-solid hover:border-black hover:border-2 hover:border-solid hover:shadow-md shadow-inner`}>
                                <td className="p-4">{city}</td>
                                <td className={`p-4 ${getSeverityClassName(aqi)}`}>{aqi.toFixed(2)}</td>
                                <td className="p-4 text-xs">{getElapsedTime(timestamp)}</td>
                            </tr>);
                        })}

                        </tbody>
                    </table>
                </div>

                <div className="flex flex-grow">
                    {!currentCityId && <BarChart aqiData={airQualityData} standards={AirQualityStandards}/>}
                    {currentCityId !== 0 && (
                        <section>
                            <button className="p-4 bg-neutral-500 text-white" onClick={() => setCurrentCityId(0)}>Back</button>
                            <h1 className="text-6xl font-bold">{currentCityData?.city}</h1>
                            <h1 className="text-3xl font-bold">{currentCityData?.aqi.toFixed(2)}</h1>
                            <BarChart aqiData={airQualityData} standards={AirQualityStandards} cityId={currentCityId}/>
                        </section>
                    )}
                </div>
            </div>
        </div>

    );
}

export default App;
