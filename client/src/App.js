import "./App.css";
import {
  StockChartComponent,
  StockChartSeriesCollectionDirective,
  StockChartSeriesDirective,
  Inject,
  DateTime,
  Tooltip,
  RangeTooltip,
  Crosshair,
  LineSeries,
  SplineSeries,
  CandleSeries,
  HiloOpenCloseSeries,
  HiloSeries,
  RangeAreaSeries,
  Trendlines,
} from "@syncfusion/ej2-react-charts";
import {
  EmaIndicator,
  RsiIndicator,
  BollingerBands,
  TmaIndicator,
  MomentumIndicator,
  SmaIndicator,
  AtrIndicator,
  AccumulationDistributionIndicator,
  MacdIndicator,
  StochasticIndicator,
  Export,
} from "@syncfusion/ej2-react-charts";
import { format } from "date-fns";

import axios from "axios";
import { useState } from "react";

import { registerLicense } from "@syncfusion/ej2-base";

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NGaF5cXmpCdkx0Rnxbf1xzZFRGal5UTndYUiweQnxTdEZjXn1acXRXTmFYU0J0Xw=="
);

const baseURL = "http://localhost:5000";

const App = () => {
  const responseBody = {};
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(
    "Please enter required details in the given form."
  );

  const myChangeFunction = (input1) => {
    var input2 = document.getElementById("toDate");
    input2.value = input1.target.value;
  };

  const handleSubmit = (event) => {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.forEach((value, property) => (responseBody[property] = value));
    console.log(JSON.stringify(responseBody));
    if (responseBody) {
      axios
        .post(`${baseURL}/api/fetchStockData`, responseBody)
        .then((response) => {
          console.log(response);
          if (response?.data?.status == 200) {
            if (response?.data?.resultsCount !== 0) {
              const data = response?.data?.results.map((row, index) => ({
                date: format(row?.t, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
                datetime: row?.t,
                volume: row?.v,
                open: row?.o,
                close: row?.c,
                high: row?.h,
                low: row?.l,
              }));
              setChartData(data);
              setIsLoading(false);
            } else {
              // alert("No Data Available.");
              setChartData([]);
              setMessage("No Data Available.");
              setIsLoading(false);
            }
          } else {
            alert(response?.data?.message);
            // setMessage(response?.data?.message)
            setChartData([]);
            setIsLoading(false);
          }
        });
    }
  };

  console.log(chartData);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="formData grid-container">
          <div className="FormInput grid-item">
            <label for="symbol" className="labelText">
              Symbol&nbsp;
            </label>
            <input
              type="text"
              className="inputField"
              name="symbol"
              label="Symbol"
            ></input>
          </div>
          <div className="FormInput grid-item">
            <label for="fromDate" className="labelText">
              From&nbsp;Date&nbsp;
            </label>
            <input
              id="fromDate"
              onChange={myChangeFunction}
              className="inputDateField grid-item"
              name="fromDate"
              type="date"
            ></input>
          </div>
          <div className="FormInput grid-item">
            <label for="toDate" className="labelText">
              To&nbsp;Date&nbsp;
            </label>
            <input
              id="toDate"
              className="inputDateField"
              name="toDate"
              type="date"
            ></input>
          </div>
          <input className="FormButton" type="submit"></input>
        </div>
      </form>
      <div className="BlockDiv"></div>
      {chartData?.map((item, index) =>
        index == 0 ? (
          <div className="openLowRow">
            <span>Open:-&nbsp;{item?.open}</span>
            <span>High:-&nbsp;{chartData[chartData.length - 1].high}</span>
            <span>Low:-&nbsp;{item?.low}</span>
            <span>Close:-&nbsp;{chartData[chartData.length - 1].close}</span>
            <span>Volume:-&nbsp;{chartData[chartData.length - 1].volume}</span>
          </div>
        ) : (
          <></>
        )
      )}
      {chartData?.length ? (
        <div className="e-bigger">
          <StockChartComponent
            key={chartData}
            id="stockchart"
            primaryXAxis={{
              valueType: "DateTime",
              majorGridLines: { width: 0 },
              majorTickLines: { color: "transparent" },
              crosshairTooltip: { enable: true },
            }}
            primaryYAxis={{
              labelFormat: "n0",
              lineStyle: { width: 0 },
              rangePadding: "None",
              majorTickLines: { width: 0 },
            }}
            height="500"
          >
            <Inject
              services={[
                DateTime,
                Tooltip,
                RangeTooltip,
                Crosshair,
                LineSeries,
                SplineSeries,
                CandleSeries,
                HiloOpenCloseSeries,
                HiloSeries,
                RangeAreaSeries,
                Trendlines,
                EmaIndicator,
                RsiIndicator,
                BollingerBands,
                TmaIndicator,
                MomentumIndicator,
                SmaIndicator,
                AtrIndicator,
                Export,
                AccumulationDistributionIndicator,
                MacdIndicator,
                StochasticIndicator,
              ]}
            />
            <StockChartSeriesCollectionDirective>
              <StockChartSeriesDirective
                dataSource={chartData}
                type="Candle"
              ></StockChartSeriesDirective>
            </StockChartSeriesCollectionDirective>
          </StockChartComponent>
        </div>
      ) : (
        <div className="StartingDiv ">
          {isLoading ? <div className="loader"></div> :  message }
        </div>
      )}
      <div className="BlockDiv">
        {chartData?.length ? (
          <>
            <table>
              <tr>
                <th>Date</th>
                <th>Open</th>
                <th>High</th>
                <th>Low</th>
                <th>Close</th>
                <th>Volume</th>
              </tr>
              {chartData?.map((item, index) => (
                <tr>
                  <td>
                    {format(item?.datetime, "dd-MMM-yyyy HH:mm:ss.SSS")}
                    {}
                  </td>
                  <td>{item?.open}</td>
                  <td>{item?.high}</td>
                  <td>{item?.low}</td>
                  <td>{item?.close}</td>
                  <td>{item?.volume}</td>
                </tr>
              ))}
            </table>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="BlockDiv"></div>
    </>
  );
};

export default App;
