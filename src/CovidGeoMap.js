import { getProvinceCovidData } from "./fetchCovidData";
import React, { useState, useEffect } from "react";
import Chart from "react-google-charts";
import * as config from "./config";

const CovidGeoMap = () => {
  const [provinceData, setProvinceData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setProvinceData(await getProvinceCovidData()); // populates provinceData
    };

    fetchData();
  }, []);

  const geoMap = (
    <Chart
      chartType="GeoChart"
      data={provinceData}
      options={{
        region: "ID", // Indonesia
        sizeAxis: { minValue: 0, maxValue: 10000 },
        resolution: "provinces"
      }}
      // columns={columns}
      mapsApiKey={config.GOOGLE_API_KEY}
    />
  );

  return <div>{geoMap}</div>;
};

export default CovidGeoMap;
