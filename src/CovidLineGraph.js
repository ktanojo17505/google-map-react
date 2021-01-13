import { getDailyCovidData } from "./fetchCovidData";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

const CovidLineGraph = () => {
  const [dailyData, setDailyData] = useState([]);
  useEffect(() => {
    const fetchDailyAPI = async () => {
      setDailyData(await getDailyCovidData());
    };
    fetchDailyAPI();
  }, []);

  const totallineChart = dailyData.length && (
    <Line
      data={{
        labels: dailyData.map(({ date }) =>
          new Date(date).toLocaleDateString()
        ),
        datasets: [
          {
            data: dailyData.map(({ totalPositive }) => totalPositive),
            label: "Positive Cases",
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)"
          },
          {
            data: dailyData.map(({ totalDeaths }) => totalDeaths),
            label: "Deaths",
            fill: true,
            backgroundColor: "rgba(96, 18, 175, 0.2)",
            borderColor: "rgba(96, 18, 175,1)"
          },
          {
            data: dailyData.map(({ totalRecovered }) => totalRecovered),
            label: "Recovered",
            fill: true,
            backgroundColor: "rgba(228, 15, 122,0.2)",
            borderColor: "rgba(228, 15, 122,1)"
          }
        ]
      }}
    />
  );

  const dailyLineChart = dailyData.length && (
    <Line
      data={{
        labels: dailyData.map(({ date }) =>
          new Date(date).toLocaleDateString()
        ),
        datasets: [
          {
            data: dailyData.map(({ dailyPositive }) => dailyPositive),
            label: "Positive Cases",
            fill: true,
            backgroundColor: "rgba(246, 49, 49, 0.2)",
            borderColor: "rgba(246, 49, 49, 1)"
          },
          {
            data: dailyData.map(({ dailyDeaths }) => dailyDeaths),
            label: "Deaths",
            fill: true,
            backgroundColor: "rgba(73, 202, 73, 0.3)",
            borderColor: "rgba(73, 202, 73, 1)"
          },
          {
            data: dailyData.map(({ dailyRecovered }) => dailyRecovered),
            label: "Recovered",
            fill: true,
            backgroundColor: "rgba(243, 132, 21, 0.3)",
            borderColor: "rgba(243, 132, 21, 1)"
          }
        ]
      }}
    />
  );
  return (
    <div style={{ margin: "0 auto", maxWidth: 1000 }}>
      <h1>Cummulative Data</h1>
      <div>{totallineChart}</div>
      <h1>Daily Data</h1>
      <div>{dailyLineChart}</div>
    </div>
  );
};

export default CovidLineGraph;
