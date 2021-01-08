import React, { useState, useEffect } from "react";
import { NativeSelect, FormControl } from "@material-ui/core";

import { getDailyProvinceData } from "./fetchCovidData";

const ProvinceGraph = () => {
  const [provinceData, setProvinceData] = useState({});
  const [province, setProvince] = useState(-1);

  useEffect(() => {
    const fetchDailyProvinceAPI = async () => {
      setProvinceData(await getDailyProvinceData());
    };
    fetchDailyProvinceAPI();
  }, []);
  const pickProvince = provinceData.arr.length && (
    <FormControl>
      <NativeSelect
        defaultValue=""
        onChange={event => setProvince(event.target.options.selectedIndex)}
      >
        {provinceData.arr.map((entry, index) => (
          <option key={index} value={entry.name}>
            {entry.name}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );

  const provinceGraphs = province !== -1 && <div>{province}</div>;

  return (
    <div>
      <div>{pickProvince}</div>
      <div>{provinceGraphs}</div>
    </div>
  );

  //   return <div></div>;
};

export default ProvinceGraph;
