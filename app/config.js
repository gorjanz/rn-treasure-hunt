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
  ],

// image picker options
  imagePickerOptions: {
    title: 'Choose photo', // specify null or empty string to remove the title
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button

      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      videoQuality: 'high', // 'low', 'medium', or 'high'
      durationLimit: 10, // video recording max time in seconds
      // carefully test these settings
      aspectX: 2, // aspectX:aspectY, the cropping image's ratio of width to height
      aspectY: 1, // aspectX:aspectY, the cropping image's ratio of width to height
      quality: 0.2, // photos only
      angle: 0, // photos only

      allowsEditing: false, // Built in functionality to resize/reposition the image
      noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
      storageOptions: { // if this key is provided, the image will get saved in the documents/pictures directory (rather than a temporary directory)
      skipBackup: true, // image will NOT be backed up to icloud
      path: 'images' // will save image at /Documents/images rather than the root
    }
  }
}
