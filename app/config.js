import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 42.004644;
const LONGITUDE = 21.393379;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.001;

export default {

  scenes: {
    login: 0,
    map: 1
  },
  
  aspectRatio: ASPECT_RATIO,
  latitude: LATITUDE,
  longitude: LONGITUDE,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
  space: SPACE,
  
  region: {
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  },

  markers: [
    {
      coordinate: {
        latitude: 42.004915,
        longitude: 21.392972
      },
      title: '',
      description: '',
      iconName: 'book',
      iconColor: '#900'
    },
    {
      coordinate: {
        latitude: 42.003639,
        longitude: 21.392650
      },
      title: '',
      description: '',
      iconName: 'camera',
      iconColor: '#333'
    },
    {
      coordinate: {
        latitude: 42.003149,
        longitude: 21.396228
      },
      title: '',
      description: '',
      iconName: 'cart-plus',
      iconColor: '#009'
    },
    {
      coordinate: {
        latitude: 42.004441,
        longitude: 21.396496
      },
      title: '',
      description: '',
      iconName: 'briefcase',
      iconColor: '#090'
    }
  ]
}
