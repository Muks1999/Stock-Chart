// DO NOT MODIFY ANYTHING HERE, THE PLACE WHERE YOU NEED TO WRITE CODE IS MARKED CLEARLY BELOW

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(function (req, res, next) {
  const allowedOrigins = ["http://localhost:3000"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
  next();
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.enable("trust proxy");

app.post("/api/fetchStockData", (req, res) => {
  console.log(req?.body, "req");
  const { fromDate, toDate, symbol } = req.body;
  if (fromDate !== "" && toDate !== "" && symbol !== "") {
    if(new Date(fromDate)>new Date(toDate)){
        return res.status(200).send({message:"From date cannot greater than to date.",status:400});
    }
    else{
        const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${fromDate}/${toDate}?apiKey=2QRaSsG1WDZcspZp3gmBcAxHw2e38InM`;
        
        fetch(url)
        .then((response) => response.json())
        .then((data) => {
            return res.status(200).send({...data,status:200});
        });
    }
  }
  else{
    return res.status(200).send({message:"Please Fill all the fields.",status:400});
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
