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
  const requestBody = {};
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState("");
  const [message, setMessage] = useState(
    "Please enter required details in the given form."
  );

  //  function to set the selected value of fromDate into toDate.
  const handleDateChange = (e) => {
    var input2 = document.getElementById("toDate");
    input2.value = e.target.value;
  };

  // function to set the value of selected stock into the local state.

  const handleSymbolChange = (e) => {
    setSelectedStock(e?.target?.value);
  };

  // Function to handle send data to the server and get the response from the server.

  const handleSubmit = (event) => {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.forEach((value, property) => (requestBody[property] = value));
    console.log(JSON.stringify(requestBody));
    if (requestBody) {
      axios
        .post(`${baseURL}/api/fetchStockData`, {...requestBody,symbol:requestBody?.symbol?.toUpperCase()})
        .then((response) => {
          console.log(response);
          if (response?.data?.status == 200) {
            if (
              response?.data?.resultsCount &&
              response?.data?.resultsCount !== 0
            ) {
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
            } else if (response?.data?.status == 200 && response?.data?.error) {
              alert(response?.data?.error);
              setChartData([]);
              setIsLoading(false);
            } else {
              setChartData([]);
              setMessage("No Data Available.");
              setIsLoading(false);
            }
          } else {
            alert(response?.data?.message);
            setChartData([]);
            setIsLoading(false);
          }
        });
    }
  };

  return (
    <>
      {/* Here is the Form to get the data of any Stock */}
      {/* I have also added the feature of date range, User can selected only single date or can select the date range to see the data between those dates. */}

      <form onSubmit={handleSubmit}>
        <div className="formData grid-container">
          {/* Symbol */}

          <div className="FormInput grid-item">
            <label for="symbol" className="labelText">
              Symbol&nbsp;
            </label>
            <input
              onChange={handleSymbolChange}
              type="text"
              className="inputField"
              name="symbol"
              label="Symbol"
            ></input>
          </div>

          {/* After Selection of from date, toDate will automatically selected as same as fromDate So that user can see the data for particular date also. If you want to change toDate you can change*/}

          <div className="FormInput grid-item">
            <label for="fromDate" className="labelText">
              From&nbsp;Date&nbsp;
            </label>
            <input
              id="fromDate"
              onChange={handleDateChange}
              className="inputDateField grid-item"
              name="fromDate"
              type="date"
            ></input>
          </div>

          {/* To Date  */}

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

          {/*  Submit Button */}

          <input className="FormButton" type="submit"></input>
        </div>
      </form>
      <div className="BlockDiv"></div>

      {/* Here is the details of the given stock for the given date or the date range */}

      {chartData?.map((item, index) =>
        index == 0 ? (
          <div className="openLowRow">
            <span>
              Open:&nbsp;<b style={{ color: "green" }}>{item?.open}</b>
            </span>
            <span>
              High:&nbsp;
              <b style={{ color: "green" }}>
                {chartData[chartData.length - 1].high}
              </b>
            </span>
            <span>
              Low:&nbsp;<b style={{ color: "red" }}>{item?.low}</b>
            </span>
            <span>
              Close:&nbsp;
              <b style={{ color: "black" }}>
                {chartData[chartData.length - 1].close}
              </b>
            </span>
            <span>
              Volume:&nbsp;
              <b style={{ color: "black" }}>
                {chartData[chartData.length - 1].volume}
              </b>
            </span>
          </div>
        ) : (
          <></>
        )
      )}

      {/* Here is the Chart for the data we get from serve in the candle view */}

      {chartData?.length ? (
        <>
          <div className="">Chart ({selectedStock}) </div>
          <div className="e-bigger">
            <StockChartComponent
              key={chartData}
              id="stockchart"
              zoomsettings={{
                enableMouseWheelZooming: true,
                enablePinchZooming: true,
                enableSelectionZooming: true,
              }}
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
        </>
      ) : (
        <div className="StartingDiv ">
          {isLoading ? <div className="loader"></div> : message}
        </div>
      )}

      {/* Here I shown data of all the days user selected with every attrubute in a table view. */}

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
