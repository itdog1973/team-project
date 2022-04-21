import { useEffect, useState } from "react";
import "./scss/style.scss";
import { TW_CITIES } from "./utils/CITY_LIST";

function App() {
  const [location, setLocation] = useState("%E8%8A%B1%E8%93%AE%E7%B8%A3");
  const weatherUrl = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-1123A71D-C88B-4D60-A105-4B55D0714360&format=JSON&locationName=${location}`;
  const [WxArr, setWxArr] = useState([]);
  const [PoPArr, setPoPArr] = useState([]);
  const [MinTArr, setMinTArr] = useState([]);
  const [CIArr, setCIArr] = useState([]);
  const [MaxArr, setMaxArr] = useState([]);

  useEffect(() => {
    const initialLoad = async () => {
      let response = await fetch(weatherUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      let data = await response.json();
      console.log(data);
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
            <option value={v}>{v}</option>
          ))}
        </select>
      </header>
      {WxArr.map((v, i) => (
        <div class="weather" key={v.startTime}>
          <img src={require("./assets/images/sun.png")} alt="" />
          <div>開始時間：{v.startTime}</div>
          <div>結束時間：{v.endTime}</div>
          <div>天氣狀況：{v.parameter.parameterName}</div>
          <div>濕度：{PoPArr[i].parameter.parameterName}</div>
          <div>最低溫：{MinTArr[i].parameter.parameterName}</div>
          <div>最高溫：{MaxArr[i].parameter.parameterName}</div>
          <div>體感：{CIArr[i].parameter.parameterName}</div>
        </div>
      ))}
    </div>
  );
}

export default App;
