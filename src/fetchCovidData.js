import axios from "axios";
import React, { Component } from "react";

const proxy = "https://cors-anywhere.herokuapp.com/";
// const url =
//   "https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/COVID19_Indonesia_per_Provinsi/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json";

const url = "https://api.kawalcorona.com/indonesia/provinsi";
export const getProvinceCovidData = async () => {
  try {
    const { data } = await axios.get(proxy + url);
    const modifiedData = [["Province", "Positive"]];
    data.map(entry => {
      var name = entry.attributes.Provinsi;
      var positive = entry.attributes.Kasus_Posi;
      var modifiedEntry = [name, positive];
      modifiedData.push(modifiedEntry);
    });
    return modifiedData;
  } catch (error) {
    console.log(error);
  }
};
// export const getProvinceCovidData = async () => {
//   try {
//     // if fetch is successful
//     const {
//       data: { features }
//     } = await axios.get(proxy + url);
//     // console.log(features);
//     const modifiedData = [["Province", "Positive"]];
//     features.map(entry => {
//       var name = entry.attributes.Provinsi;
//       if (name !== "Indonesia") {
//         var positive = entry.attributes.Kasus_Posi;
//         // var deaths = entry.attributes.Kasus_Meni;
//         // var recovered = entry.attributes.Kasus_Semb;
//         var modifiedEntry = [name, positive];
//         modifiedData.push(modifiedEntry);
//       }
//     });
//     return modifiedData;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const getIndonesiaCovidData = async () => {
//   try {
//     const { data } = await axios.get(proxy + url + "/indonesia");
//     return data;
//     // return data;
//   } catch (error) {
//     console.log(error);
//   }
// };
