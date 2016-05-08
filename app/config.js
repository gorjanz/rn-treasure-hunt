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
    onboarding: 0,
    login: 1,
    map: 2,
    gallery: 3,
    end: 4
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
      noData: true, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
      storageOptions: { // if this key is provided, the image will get saved in the documents/pictures directory (rather than a temporary directory)
      skipBackup: true, // image will NOT be backed up to icloud
      path: 'images' // will save image at /Documents/images rather than the root
    }
  },

  login: {
    endpoint: '<url-to-the-backend-login-server>'
  },

  flickrCredentials: {
    apiKey: {
      name: 'api_key',
      value: '<value-of-the-Flicker-API-key-for-your-app>'
    },
    apiSecret: {
      value: '<value-of-the-Flicker-secret-for-your-app>'
    },
    authToken: {
      name: 'auth_token',
      value: '<value-for-the-AUTHENTICATION-TOKEN-from-the-Flicker-API>'
    }
  },

  upload: {
    endpoint: 'https://up.flickr.com/services/upload/',
    fileKey: {
      name: 'photo'
    },
    publicAccess: {
      name: 'is_public',
      value: 0  // 0 meaning not visible publicly / 1 otherwise
    },
    signature: {
      name: 'api_sig',
      value: '<generated-signature>'
    },
    maxNumberOfPhotosAllowed: 10
  },

  moveToAlbum: {
    endpoint: 'https://api.flickr.com/services/rest/',
    methodParam: {
      name: 'method',
      value: 'flickr.photosets.addPhoto'
    },
    photosetIdParam: {
      name: 'photoset_id'
    },
    photoIdParam: {
      name: 'photo_id'
    },
    responseFormatParam: {
      name: 'format',
      value: 'json'
    },
    noCallbackParam: {
      name: 'nojsoncallback',
      value: 1
    },
    signature: {
      name: 'api_sig'
    }
  },

  storage: {
    rootKey: 'photos',
    user: {
      usernameKey: 'username',
      teamDetailsKey: 'team'
    },
    currentMarkerKey: 'currentMarker',
    firstOpenKey: 'showOnboarding',
    numberOfUploadedPhotosKey: 'numberOfUploadedPhotos'
  },

  colors: {
    sceneBackgroundColor: '#5386E4',
    spinnerAnimationColor: '#B22222',
    pressHighlight: '#CAE9FF',
    buttonTextColor: '#001242',
    borderColor: '#FBFCFF'
  }
}
