import App from "./App";
const express = require("express");
const request = require("request");

const app = express();

const PORT = process.env.PORT || 3000;

const dataUrl = "https://data.covid19.go.id/public/api";

app.use((req, res, next) => {
  res.header("Access-Allow-Control-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  request(
    { url: "https://data.covid19.go.id/public/api/prov.json" },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: "error", message: error.message });
      }
      console.log(res.json(JSON.parse(body)));
    }
  );
});

app.get("/1", (req, res) => {
  request(
    { url: "https://data.covid19.go.id/public/api/update.json" },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: "error", message: error.message });
      }
      console.log(res.json(JSON.parse(body)));
    }
  );
});

app.get("/covid-19", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.js"));
});
app.listen(PORT, () => console.log(`listening on ${PORT}`));
