import axios from "axios";
import React, { Component } from "react";

// class fetchCovidData extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       ProvinceCovidData: []
//     };
//   }
// https://api.kawalcorona.com/indonesia/provinsi
const proxy = "https://cors-anywhere.herokuapp.com/";
const url = "https://api.kawalcorona.com/indonesia/provinsi";
export const getCovidData = () => {
  //   var xhr = new XMLHttpRequest();
  //   xhr.open("GET", "./https://api.kawalcorona.com/indonesia/provinsi", true);
  //   xhr.onload = function(e) {
  //     if (xhr.readyState === 4) {
  //       if (xhr.status === 200) {
  //         var parse = JSON.parse(xhr.response);
  //         console.log(parse);
  //       }
  //     } else {
  //       console.error(xhr.statusText);
  //     }
  //   };
  //   fetch(proxy + url)
  //     .then(response => response.json())
  //     .then(data => console.log(data));
  axios
    .get(proxy + url)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
};

//   render() {
//     this.getCovidData();
//     return <div>Hello</div>;
//   }
// }

// export default fetchCovidData;
