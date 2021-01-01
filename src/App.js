import logo from "./logo.svg";
import "./App.css";
import React from "react";
import {
  InfoWindow,
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import Geocode from "react-geocode";
import { Button, Descriptions } from "antd";
import AutoComplete from "react-google-autocomplete";
import mapStyles from "./mapStyles";
// import Button from "react-bootstrap/Button";
import * as config from "./config";
import * as HospitalData from "./data/all.json";
// import CovidGeoMap from "./CovidGeoMap";
import { getProvinceCovidData } from "./fetchCovidData";
import CovidGeoMap from "./CovidGeoMap";
// import * as publicHospitalData from "./data/rumahsakitumum.json";
// import * as privateHospitalData from "./data/rumahsakitkhusus.json";
// import * as publicHealthCenterData from "./data/puskesmas.json";

Geocode.setApiKey(config.GOOGLE_API_KEY);

class App extends React.Component {
  constructor(props) {
    super(props);
    var HospitalLocations = [];
    var clickHospital = [];
    var position;
    var hospitalName;
    var id;
    for (let index = 0; index < HospitalData.hospitals.length; ++index) {
      id = index;
      var latitude = HospitalData.hospitals[index].latitude;
      var longitude = HospitalData.hospitals[index].longitude;
      position = { latitude, longitude };
      hospitalName = HospitalData.hospitals[index].nama;
      var entry = { id, position, hospitalName };
      HospitalLocations.push(entry);
      clickHospital.push(false);
    }
    this.state.Hospitals = HospitalLocations;
    this.state.didClickHospital = clickHospital;
  }
  state = {
    address: "",
    city: "",
    area: "",
    state: "",
    zoom: 11,
    height: 400,
    mapPosition: {
      lat: 0,
      lng: 0
    },
    markerPosition: {
      lat: 0,
      lng: 0
    },
    placeHospitals: false,
    Hospitals: [],
    didClickHospital: []
    // provinceCovidData: []
  };

  async componentDidMount() {
    // const data = await getIndonesiaCovidData();
    // const fetchedData = await getProvinceCovidData();
    // this.setState({ provinceCovidData: fetchedData });
    // console.log(data);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState(
          {
            mapPosition: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            markerPosition: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          },
          () => {
            Geocode.fromLatLng(
              position.coords.latitude,
              position.coords.longitude
            ).then(response => {
              const address = response.results[0].formatted_address,
                addressArray = response.results[0].address_components,
                city = this.getCity(addressArray),
                area = this.getArea(addressArray),
                state = this.getState(addressArray);

              this.setState({
                address: address ? address : "",
                area: area ? area : "",
                city: city ? city : "",
                state: state ? state : ""
              });
            });
          }
        );
      });
    }
  }

  getCity = addressArray => {
    let city = "";
    for (let index = 0; index < addressArray.length; index++) {
      if (
        addressArray[index].types[0] &&
        "administrative_area_level_2" === addressArray[index].types[0]
      ) {
        city = addressArray[index].long_name;
        return city;
      }
    }
  };

  getArea = addressArray => {
    let area = "";
    for (let index = 0; index < addressArray.length; index++) {
      if (addressArray[index].types[0]) {
        for (let j = 0; j < addressArray.length; ++j) {
          if (
            "sublocality_level_1" === addressArray[index].types[j] ||
            "locality" === addressArray[index].types[j]
          ) {
            area = addressArray[index].long_name;
            return area;
          }
        }
      }
    }
  };

  getState = addressArray => {
    let state = "";
    for (let index = 0; index < addressArray.length; ++index) {
      for (let index = 0; index < addressArray.length; ++index) {
        if (
          addressArray[index].types[0] &&
          "administrative_area_level_1" === addressArray[index].types[0]
        ) {
          state = addressArray[index].long_name;
          return state;
        }
      }
    }
  };

  onMarkerDragEnd = event => {
    let newLat = event.latLng.lat();
    let newLng = event.latLng.lng();
    Geocode.fromLatLng(newLat, newLng).then(response => {
      const address = response.results[0].formatted_address,
        addressArray = response.results[0].address_components,
        city = this.getCity(addressArray),
        area = this.getArea(addressArray),
        state = this.getState(addressArray);

      this.setState({
        address: address ? address : "",
        area: area ? area : "",
        city: city ? city : "",
        state: state ? state : "",
        markerPosition: {
          lat: newLat,
          lng: newLng
        },
        mapPosition: {
          lat: newLat,
          lng: newLng
        }
      });
    });
  };

  onPlaceSelected = place => {
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = this.getCity(addressArray),
      area = this.getArea(addressArray),
      state = this.getArea(addressArray),
      newLat = place.geometry.location.lat(),
      newLng = place.geometry.location.lng();
    this.setState({
      address: address ? address : "",
      area: area ? area : "",
      city: city ? city : "",
      state: state ? state : "",
      markerPosition: {
        lat: newLat,
        lng: newLng
      },
      mapPosition: {
        lat: newLat,
        lng: newLng
      }
    });
  };

  placeHospitals = () => {
    var doPlaceHospitals = this.state.placeHospitals;
    doPlaceHospitals = !doPlaceHospitals;
    this.setState({ placeHospitals: doPlaceHospitals });
  };

  render() {
    const options = {
      styles: mapStyles
    };
    // getProvinceCovidData();
    // getIndonesiaCovidData();
    const MapWithAMarker = withScriptjs(
      withGoogleMap(props => (
        <div>
          <GoogleMap
            defaultZoom={this.state.zoom}
            defaultCenter={{
              lat: this.state.mapPosition.lat,
              lng: this.state.mapPosition.lng
            }}
            options={options}
            onClick={this.placeMarker}
          >
            <Marker
              draggable={true}
              onDragEnd={this.onMarkerDragEnd}
              position={{
                lat: this.state.markerPosition.lat,
                lng: this.state.markerPosition.lng
              }}
            >
              <InfoWindow>
                <div>{this.state.address}</div>
              </InfoWindow>
            </Marker>
            {this.state.placeHospitals &&
              this.state.Hospitals.map(hospitalLoc => (
                <Marker
                  draggable={false}
                  position={{
                    lat: hospitalLoc.position.latitude,
                    lng: hospitalLoc.position.longitude
                  }}
                  key={hospitalLoc.id}
                  // onClick={this.clickHospital(hospitalLoc.id)}
                >
                  {/* {this.state.didClickHospital[index] && (
                    <InfoWindow>
                      <div>{hospitalLoc.name}</div>
                    </InfoWindow>
                  )} */}
                </Marker>
              ))}
            <AutoComplete
              style={{
                width: "100%",
                height: "40px",
                paddingLeft: 16,
                marginTop: 2,
                marginBottom: "2rem"
              }}
              types={["(regions)"]}
              onPlaceSelected={this.onPlaceSelected}
            />
          </GoogleMap>
        </div>
      ))
    );
    // const { provinceCovidData } = this.state;
    // console.log(provinceCovidData);
    return (
      <div style={{ padding: "1rem", margin: "0 auto", maxWidth: 1000 }}>
        <h1>Google Maps Basic</h1>
        <Descriptions bordered>
          <Descriptions.Item label="City">{this.state.city}</Descriptions.Item>
          <Descriptions.Item label="Area">{this.state.area}</Descriptions.Item>
          <Descriptions.Item label="State">
            {this.state.state}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {this.state.address}
          </Descriptions.Item>
        </Descriptions>
        <MapWithAMarker
          googleMapURL={
            "https://maps.googleapis.com/maps/api/js?key=" +
            config.GOOGLE_API_KEY +
            "&v=3.exp&libraries=geometry,drawing,places"
          }
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
        <div style={{ marginTop: "2.5rem" }}>
          <Button onClick={this.placeHospitals}>Hospitals</Button>
        </div>
        <CovidGeoMap />
        {/* <CovidGeoMap data={provinceCovidData} /> */}
      </div>
    );
  }
}

export default App;
