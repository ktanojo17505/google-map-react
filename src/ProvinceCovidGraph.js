import React, { useState, useEffect } from "react";
import { NativeSelect, FormControl } from "@material-ui/core";
import { Doughnut } from "react-chartjs-2";

import { getDailyProvinceData } from "./fetchCovidData";

const ProvinceGraph = () => {
  const [provinceData, setProvinceData] = useState([]);
  const [province, setProvince] = useState(-1);

  useEffect(() => {
    const fetchDailyProvinceAPI = async () => {
      setProvinceData(await getDailyProvinceData());
    };
    fetchDailyProvinceAPI();
  }, []);

  const pickProvince = provinceData.length && (
    <FormControl>
      <NativeSelect
        defaultValue=""
        onChange={event => setProvince(event.target.options.selectedIndex)}
      >
        {provinceData.map((entry, index) => (
          <option key={index} value={entry.name}>
            {entry.name}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );

  function male_female_data(index) {
    return {
      labels: ["Male", "Female"],
      datasets: [
        {
          data: [provinceData[index].num_male, provinceData[index].num_female],
          backgroundColor: ["rgb(139, 193, 243)", "rgb(243, 139, 210)"]
        }
      ]
    };
  }

  function age_data(index) {
    return {
      labels: [
        "Age 0-5",
        "Age 6-18",
        "Age 19-30",
        "Age 31-45",
        "Age 46-59",
        "Age >= 60"
      ],
      datasets: [
        {
          data: [
            provinceData[index].age_0_5,
            provinceData[index].age_6_18,
            provinceData[index].age_19_30,
            provinceData[index].age_31_45,
            provinceData[index].age_46_59,
            provinceData[index].age_grt60
          ],
          backgroundColor: [
            "rgb(243, 78, 70)",
            "rgb(248, 141, 66)",
            "rgb(135, 238, 102)",
            "rgb(102, 233, 238)",
            "rgb(105, 125, 234)",
            "rgb(184, 105, 234)"
          ]
        }
      ]
    };
  }

  // const gender_graph_options = {
  //   reverse: true
  // };

  const provinceGraphs = province !== -1 && (
    <div>
      <Doughnut
        data={male_female_data(province)}
        // options={gender_graph_options}
      />
      <Doughnut data={age_data(province)} />
    </div>
  );

  return (
    <div>
      <div>{pickProvince}</div>
      <div>{provinceGraphs}</div>
    </div>
  );
};

export default ProvinceGraph;
