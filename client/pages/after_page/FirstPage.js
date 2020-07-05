import React, { Component } from 'react'
import {getAreaOfPolygon} from 'geolib'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity
} from 'react-native'

import MapView, {
  MAP_TYPES,
  Polygon,
  Marker,
  ProviderPropType,
  PROVIDER_GOOGLE
} from 'react-native-maps'
/*import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'  enable when you need user's location*/



const { width, height } = Dimensions.get('window')

const ASPECT_RATIO = width / height
const LATITUDE = 49.197430
const LONGITUDE = -119.816715
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
let id = 0

class Maps extends Component {
  constructor(props) {
    super(props)
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      polygons: [],
      editing: null,
      creatingHole: false
    }
  }
  /* Activate for current location
  async componentDidMount(){
    const { status, permission } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      console.log('Salam')
      let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
      let reg = {...this.state.region}
      reg.latitude = location.coords.latitude
      reg.longitude = location.coords.longitude
      this.setState({region:reg})
    } else {
      throw new Error('Location permission not granted');
    }
    
  } */
  finish() {
   const { polygons, editing } = this.state;
   //log the coordinates of polygon
   var cds_object = [editing]
   var coordinates = cds_object[0]["coordinates"]
   var new_ar = []
   for(let i=0;i<coordinates.length;i++){
     new_ar.push([coordinates[i]["latitude"],coordinates[i]["longitude"]])
   }
   console.log("Locations:\n",new_ar)
  console.log("Area of polygon:", getAreaOfPolygon(new_ar),"m^2");
  
   this.setState({
   polygons: [...polygons, editing],
   editing: null,
   creatingHole: false,
  });
 
  }

  clear = () => {
    const poly = this.state.polygons.slice(0, -1)
    if(this.state.editing){
      this.setState({
        editing:null,
      })
    }
    else{
    this.setState({
      polygons: poly,
      editing: null,
      creatingHole: false
    })
  }
  }

  createHole() {
    const { editing, creatingHole } = this.state
    if (!creatingHole) {
      this.setState({
        creatingHole: true,
        editing: {
          ...editing,
          holes: [...editing.holes, []]
        }
      })
    } else {
      const holes = [...editing.holes]
      if (holes[holes.length - 1].length === 0) {
        holes.pop()
        this.setState({
          editing: {
            ...editing,
            holes
          }
        })
      }
      this.setState({ creatingHole: false })
    }
  }

  onPress(e) {

    const { editing, creatingHole } = this.state
    if (!editing) {
      this.setState({
        editing: {
          id: id++,
          coordinates: [e.nativeEvent.coordinate],
          holes: []
        }
      })
    } else if (!creatingHole) {
      this.setState({
        editing: {
          ...editing,
          coordinates: [...editing.coordinates, e.nativeEvent.coordinate]
        }
      })
    } else {
      const holes = [...editing.holes]
      holes[holes.length - 1] = [
        ...holes[holes.length - 1],
        e.nativeEvent.coordinate
      ]
      this.setState({
        editing: {
          ...editing,
          id: id++, // keep incrementing id to trigger display refresh
          coordinates: [...editing.coordinates],
          holes
        }
      })
    }
    
  }

  render() {
    const mapOptions = {
      scrollEnabled: true
    }

    if (this.state.editing) {
      mapOptions.scrollEnabled = false
      mapOptions.onPanDrag = e => this.onPress(e)
    }

    return (
      <View style={styles.container} >
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          mapType={MAP_TYPES.HYBRID}
          initialRegion={this.state.region}
          onPress={e => this.onPress(e)}
          {...mapOptions}
        >
          <Marker coordinate={{latitude:this.state.region.latitude,longitude:this.state.region.longitude}} title='Target field' />
          {this.state.polygons.map(polygon => (
            <Polygon
              key={polygon.id}
              coordinates={polygon.coordinates}
              holes={polygon.holes}
              strokeColor="#F00"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
            />
          ))}
          {this.state.editing && (
            <Polygon
              key={this.state.editing.id}
              coordinates={this.state.editing.coordinates}
              holes={this.state.editing.holes}
              strokeColor="#000"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
            />
          )}
        </MapView>

        <View style={styles.buttonContainer}>
          {this.state.editing && (
            <TouchableOpacity
              onPress={() => this.createHole()}
              style={[styles.bubble, styles.button]}
            >
              <Text>
                {this.state.creatingHole ? 'Finish Hole' : 'Create Hole'}
              </Text>
            </TouchableOpacity>
          )}
          {this.state.editing && (
            <TouchableOpacity
              onPress={() => this.finish()}
              style={[styles.bubble, styles.button]}
            >
              <Text>Finish</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => this.clear()}
          style={[styles.bubble, styles.button]}
        >
          <Text>Clear</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

Maps.propTypes = {
  provider: ProviderPropType
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },
  latlng: {
    width: 200,
    alignItems: 'stretch'
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent'
  }
})

export default Maps