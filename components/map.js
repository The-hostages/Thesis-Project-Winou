import * as React from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Polyline from "@mapbox/polyline";

const locations = require("../locations.json");
const trainligne = require("../encodedPoly.json");

const { width, height } = Dimensions.get("window");
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
var API_KEY = "AIzaSyAXcO-TwBc8G8_ktmHpTZZx4KdBeWnKdmE";
export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      line: this?.props?.route?.params?.line || -1,
      positionState: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      markerPosition: {
        latitude: 0,
        longitude: 0,
      },
      loading: true,
      loadingMap: false,
      locations: locations,
      trainligne: trainligne,
      longitudeStation: 0,
      latitudeStation: 0,
      allCoordsTrain: [],
    };
    console.log(this.state.line);
  }

  changeLine(x) {
    this.setState = { line: x };
  }

  async getLocationAsync() {
    try {
      const { status } = await Permissions.getAsync(Permissions.LOCATION);
      if (status !== "granted") {
        const response = await Permissions.askAsync(Permissions.LOCATION);
      }
      var place = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
      this.setState({ place });
      var lat = parseFloat(place.coords.latitude);
      var long = parseFloat(place.coords.longitude);

      var region = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
      await this._getNearestStation(region.latitude, region.longitude);
      this.setState(
        {
          positionState: region,
        },
        this.mergeCoords
      );
    } catch (e) {}
  }
  async componentDidMount() {
    await this.AlltrainItenerary();
    await this.getLocationAsync();
  }
  async getDirections(startLoc, desLoc) {
    try {
      const resp = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${desLoc}&key=AIzaSyAXcO-TwBc8G8_ktmHpTZZx4KdBeWnKdmE&mode=walking`
      );

      const response = await resp.data.routes[0];

      // const distanceTime =  response.legs[0]
      // const distance =  distanceTime.distance.text
      // const time = distanceTime.duration.text

      const points = Polyline.decode(response.overview_polyline.points);
      const coords = points.map((point) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      this.setState({ coords });
    } catch (error) {}
  }
  _getNearestStation = async (lat, long) => {
    try {
      const { locations } = this.state;
      const current = { lat, long };
      const stationstring = locations
        .map((location) =>
          [location.coords.latitude, location.coords.longitude].join("%2C")
        )
        .join("%7C");
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=walking&origins=${current.lat},${current.long}&destinations=${stationstring}&key=${API_KEY}`
      );
      const res = response.data.rows[0].elements
        .map((ele, i) => {
          return {
            ...ele,
            destination_addresses: response.data.destination_addresses[i],
            coords: locations[i].coords,
          };
        })
        .sort((a, b) => a.duration.value - b.duration.value)[0];

      this.setState({
        latitudeStation: res.coords.latitude,
        longitudeStation: res.coords.longitude,
      });
    } catch (e) {}
  };

  async AlltrainItenerary() {
    try {
      const { trainligne } = this.state;

      const add = await Object.values(trainligne).map((ligne) =>
        ligne.map((ougabouga) => Polyline.decode(ougabouga))
      );
      // const points = await Polyline.decode(trainligne.ligneOne[1]);
      // const allCoordsTrain = add.map((ligne) =>
      //   ligne.flat().map((point) => ({
      //     latitude: point[0],
      //     longitude: point[1],
      //   }))
      // );
      const allCoordsTrain = add
        .map((poly) => poly.flat())
        .map((point) =>
          point.map((pis) => ({
            latitude: pis[0],
            longitude: pis[1],
          }))
        );
      // (JSON.stringify(allCoordsTrain));
      this.setState({ allCoordsTrain });
      // return (
      //   <View>
      //     {allCoordsTrain.map((ligne, idx) => (
      //       <MapView.Polyline
      //         key={idx}
      //         strokeWidth={4}
      //         strokeColor="rgba(22,140,0,0.7)"
      //         coordinates={ligne}
      //       />
      //     ))}
      //   </View>
      // );
    } catch (e) {
      console.error("error", e);
    }
  }

  mergeCoords = async () => {
    const { positionState, latitudeStation, longitudeStation } = this.state;

    const hasStartAndEnd =
      positionState.latitude !== null && latitudeStation !== null;

    if (hasStartAndEnd) {
      const concatStart = `${positionState.latitude},${positionState.longitude}`;
      const concatEnd = `${latitudeStation},${longitudeStation}`;
      await this.getDirections(concatStart, concatEnd);
    }
  };
  //till here

  componentDidUpdate() {
    const { positionState } = this.state;
    if (positionState.latitude !== 0) {
      this.state.loadingMap = true;
      this.state.loading = false;
    }
  }
  onMarkerPress = (location) => async () => {
    const {
      coords: { latitude, longitude },
    } = location;
    this.setState(
      {
        destination: location,
        desLatitude: latitude,
        desLongitude: longitude,
      },
      this.mergeCoords
    );
  };
  // renderMarkers = () => {
  //   const { locations } = this.state;
  //   return (
  //     <View>
  //       {locations.map((location, idx) => {
  //         const {
  //           coords: { latitude, longitude },
  //         } = location;
  //         return (
  //           <Marker
  //             key={idx}
  //             coordinate={{ latitude, longitude }}
  //             onPress={this.onMarkerPress(location)}
  //           />
  //         );
  //       })}
  //     </View>
  //   );
  // };

  render() {
    let {
      positionState,
      coords,
      loadingMap,
      coordsTrain,
      longitudeStation,
      latitudeStation,
      allCoordsTrain,
    } = this.state;
    return (
      <View style={Styles.container}>
        {loadingMap && (
          <MapView
            style={Styles.map}
            initialRegion={positionState}
            showsUserLocation
            rotateEnabled={false}
          >
            {/* {this.renderMarkers()} */}
            <MapView.Polyline
              strokeWidth={4}
              strokeColor="rgba(255,140,0,0.8)"
              coordinates={coords}
            />
            {allCoordsTrain.map((ligne, idx) => (
              <MapView.Polyline
                key={idx}
                strokeWidth={4}
                strokeColor="rgba(22,140,0,0.7)"
                coordinates={ligne}
              />
            ))}

            {/* <MapView.Polyline
              strokeWidth={4}
              strokeColor="rgba(22,140,0,0.7)"
              coordinates={coordsTrain}
            /> */}

            <Marker
              coordinate={{
                latitude: latitudeStation,
                longitude: longitudeStation,
              }}
              image={require("../assets/station3.png")}
            />
          </MapView>
        )}
        {/* <MyTabs /> */}
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  radius: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    overflow: "hidden",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(0, 112, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    height: 20,
    width: 20,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 20 / 2,
    overflow: "hidden",
    backgroundColor: "#007AFF",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },

  map: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    // left: 0,
    // right: 0,
    // top: 0,
    // bottom: 0,
    // position: "absolute",
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
