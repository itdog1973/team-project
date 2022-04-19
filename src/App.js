import { useEffect, useState } from "react";
import "./scss/style.scss";
import { TW_CITIES } from "./utils/CITY_LIST";
import sunny from "./images/sun.png";
import rainy from "./images/rainy.gif";
import cloudyMoon from "./images/cloudy.png";
import cloudySun from "./images/cloudy_sun.png";

function App() {
  const [location, setLocation] = useState("%E8%87%BA%E5%8C%97%E5%B8%82");
  const weatherUrl = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-1123A71D-C88B-4D60-A105-4B55D0714360&format=JSON&locationName=${location}`;
  const [WxArr, setWxArr] = useState([]);
  const [PoPArr, setPoPArr] = useState([]);
  const [MinTArr, setMinTArr] = useState([]);
  const [CIArr, setCIArr] = useState([]);
  const [MaxArr, setMaxArr] = useState([]);
  const [unit, setUnit] = useState("C");

  useEffect(() => {
    const initialLoad = async () => {
      let response = await fetch(weatherUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      let data = await response.json();

      setWxArr(data.records.location[0].weatherElement[0].time);
      setPoPArr(data.records.location[0].weatherElement[1].time);
      setMinTArr(data.records.location[0].weatherElement[2].time);
      setCIArr(data.records.location[0].weatherElement[3].time);
      setMaxArr(data.records.location[0].weatherElement[4].time);
    };
    initialLoad();
  }, [location]);

  const submitHandler = (e) => {
    e.preventDefault();
    let city = encodeURI(e.target.value);
    setLocation(city);
  };

  return (
    <div className="App">
      <header>
        <h1>Future weather in :</h1>
        <select onChange={submitHandler} name="region" id="region">
          {TW_CITIES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </header>
      <div className="weather__container">
        {WxArr.map((v, i) => (
          <div className="weather" key={v.startTime}>
            <div className="weather__pic">
              <img
                src={
                  v.parameter.parameterValue > 7
                    ? rainy
                    : v.parameter.parameterValue === 1
                    ? sunny
                    : v.startTime.split(" ")[1] === "06:00:00"
                    ? cloudySun
                    : cloudyMoon
                }
                alt=""
              />
            </div>
            <div className="weather__txt">
              <div>開始時間：{v.startTime}</div>
              <div>結束時間：{v.endTime}</div>
              <div>天氣狀況：{v.parameter.parameterName}</div>
              <div>濕度：{PoPArr[i].parameter.parameterName}</div>
              <div>
                最低溫：
                {unit === "C"
                  ? `${MinTArr[i].parameter.parameterName}℃`
                  : `${Math.round(
                      (MinTArr[i].parameter.parameterName * 9) / 5 + 32
                    )}°F`}
              </div>
              <div>
                最高溫：
                {unit === "C"
                  ? `${MaxArr[i].parameter.parameterName}℃`
                  : `${Math.round(
                      (MaxArr[i].parameter.parameterName * 9) / 5 + 32
                    )}°F`}
              </div>
              <div>體感：{CIArr[i].parameter.parameterName}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="FC-switch">
        <button
          onClick={() => {
            setUnit("F");
          }}
          className="F-btn btn"
        >
          ℉
        </button>
        <button
          onClick={() => {
            setUnit("C");
          }}
          className="C-btn btn"
        >
          ℃
        </button>
      </div>
    </div>
  );
}

export default App;
