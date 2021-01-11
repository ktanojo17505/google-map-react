import React from "react";
import CovidGeoMap from "./CovidGeoMap";
import CovidLineGraph from "./CovidLineGraph";
import ProvinceGraph from "./ProvinceCovidGraph";
import HospitalMap from "./hospitalMap";

class App extends React.Component {
  render() {
    return (
      <div>
        <HospitalMap />
        {/* <CovidGeoMap />
        <CovidLineGraph />
        <ProvinceGraph /> */}
        {/* <CovidGeoMap data={provinceCovidData} /> */}
      </div>
    );
  }
}

export default App;
