import axios from "axios";
import React, { Component } from "react";

const proxy = "https://cors-anywhere.herokuapp.com/";
// const url =
//   "https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/COVID19_Indonesia_per_Provinsi/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json";

const url = "https://data.covid19.go.id/public";
const indo = "https://apicovid19indonesia-v2.vercel.app/api/indonesia/more";

// const dailyurl = "https://data.covid19.go.id/public/api/update.json";

export const getProvinceCovidData = async () => {
  try {
    const {
      data: { list_data }
    } = await axios.get(proxy + url + "/api/prov.json");
    const modifiedData = [["Province", "Positive"]];
    list_data.map(entry => {
      var name = entry.key;
      var positive = entry.jumlah_kasus;
      var modifiedEntry = [name, positive];
      modifiedData.push(modifiedEntry);
    });
    return modifiedData;
  } catch (error) {
    console.log(error);
  }
};

export const getIndonesiaCovidData = async () => {
  try {
    const { data } = await axios.get(proxy + indo);
    return data;
    // return data;
  } catch (error) {
    console.log(error);
  }
};

export const getDailyCovidData = async () => {
  try {
    const {
      data: {
        update: { harian }
      }
    } = await axios.get(proxy + url + "/api/update.json");
    const modifiedData = harian.map(entry => ({
      dailyRecovered: entry.jumlah_sembuh.value,
      totalRecovered: entry.jumlah_sembuh_kum.value,
      dailyDeaths: entry.jumlah_meninggal.value,
      totalDeaths: entry.jumlah_meninggal_kum.value,
      dailyPositive: entry.jumlah_positif.value,
      totalPositive: entry.jumlah_positif_kum.value,
      date: entry.key_as_string
    }));
    return modifiedData;
    // console.log(harian);
  } catch (error) {
    console.log(error);
  }
};
