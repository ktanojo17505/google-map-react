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
import { Descriptions } from "antd";
import AutoComplete from "react-google-autocomplete";
import mapStyles from "./mapStyles";
import * as config from "./config";
import * as publicHospitalData from "./data/rumahsakitumum.json";
import * as privateHospitalData from "./data/rumahsakitkhusus.json";
import * as publicHealthCenterData from "./data/puskesmas.json";

Geocode.setApiKey(config.GOOGLE_API_KEY);

class App extends React.Component {
  state = {
    address: "",
    city: "",
    area: "",
    state: "",
    zoom: 15,
    height: 400,
    mapPosition: {
      lat: 0,
      lng: 0
    },
    markerPosition: {
      lat: 0,
      lng: 0
    },
    markers: []
  };

  componentDidMount() {
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
    console.log(event);
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

  placeMarker = event => {
    // console.log(event);
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const position = { lat, lng };
    const newMarker = { position };
    this.setState({
      markers: [...this.state.markers, newMarker]
    });
    // console.log(this.state.markers);
  };

  render() {
    const options = {
      styles: mapStyles
    };
    const MapWithAMarker = withScriptjs(
      withGoogleMap(props => (
        <GoogleMap
          defaultZoom={8}
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
          {privateHospitalData.features.map(privateHospital => (
            <Marker
              draggable={false}
              position={{
                lat: privateHospital.properties.location.latitude,
                lng: privateHospital.properties.location.longitude
              }}
            />
          ))}
          {publicHospitalData.features.map(publicHospital => (
            <Marker
              draggable={false}
              position={{
                lat: publicHospital.properties.location.latitude,
                lng: publicHospital.properties.location.longitude
              }}
            />
          ))}
          {publicHealthCenterData.features.map(publicHealthCenter => (
            <Marker
              draggable={false}
              position={{
                lat: publicHealthCenter.properties.location.latitude,
                lng: publicHealthCenter.properties.location.longitude
              }}
            />
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
      ))
    );

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
      </div>
    );
  }
}

export default App;
