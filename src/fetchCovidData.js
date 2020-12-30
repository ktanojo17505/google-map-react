import axios from "axios";
import React, { Component } from "react";

const proxy = "https://cors-anywhere.herokuapp.com/";
const url = "https://api.kawalcorona.com/";

export const getProvinceCovidData = async () => {
  await axios
    .get(proxy + url + "/indonesia/provinsi")
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.log(error);
    });
};

export const getIndonesiaCovidData = async () => {
  await axios
    .get(proxy + url + "/indonesia")
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.log(error);
    });
};
