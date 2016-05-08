'use strict';

import config from '../config';
import md5 from 'md5';
import {getFromAsyncStorage, saveToStorage} from './storage';

import {Alert} from 'react-native';

/**
 * Upload a photo to an endpoint.
 *
 * @param {Object} image the photo object containing uri and name properties at least
 */
export function uploadPhoto(image) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', config.upload.endpoint);

    request.onload = (data) => {
      if (request.status !== 200) {
        console.log('upload of image:', image.name, ' failed with status: ', request.status);
        Alert.alert('Upload failed.', 'An error occurred while uploading image: ' + imageObj.name);

        reject('Error in uploading image');
      }

      console.log('upload of image: ', image.name, ' succeeded');
      console.log('returned data: ', request.responseText);

      const uploadedPhotoId = extractPhotoId(request.responseText);
      moveToAlbum(uploadedPhotoId, image.albumId);

      resolve('Success: The photo ' + imageObj.name + ' have been uploaded, and moved to the correct album.');
    };

    const imageObj = {
      uri: image.uri,
      type: 'image/jpeg',
      name: image.name
    };

    // set POST body parameters
    const formData = new FormData();
    formData.append(config.upload.fileKey.name, imageObj);
    formData.append(config.flickrCredentials.apiKey.name, config.flickrCredentials.apiKey.value);
    formData.append(config.flickrCredentials.authToken.name, config.flickrCredentials.authToken.value);
    formData.append(config.upload.publicAccess.name, config.upload.publicAccess.value);
    formData.append(config.upload.signature.name, config.upload.signature.value);

    if (request.upload) {
      request.upload.onprogress = (event) => {
        console.log(Math.round((event.loaded / event.total) * 100), ' complete');
      };
    }

    console.log('Attempting to upload image: ', image.name);
    request.send(formData);
  });
}

/**
 * Helper function which will upload the given photos.
 *
 * @param {Array} photos which photos to upload
 * @param {function} function to execute when starting the upload of the imageSize
 * @param {function} function to execute when the uploading finishes
 */
export function uploadPhotos(photos, onStartCallback, onEndCallback) {
  // get the allowed maximum
  const maxAllowed = config.upload.maxNumberOfPhotosAllowed;

  if (photos && photos.length === 0) {
    Alert.alert('Attention.', 'Please select some photos...');
    return;
  }

  // if the user tries to upload more than the allowed, restrict it
  if (photos && photos.length > maxAllowed) {
    Alert.alert('Woooow. Too many pictures.', 'Please select only the best ones, up to ' + maxAllowed + ' the most.');
    return;
  }

  // find out how many they've uploaded sofar
  getFromAsyncStorage(config.storage.numberOfUploadedPhotosKey)
    .then((uploadedPhotosStorageData) => {
      let numberOfUploadedPhotos = 0;
      if (uploadedPhotosStorageData) {
        const parsedData = JSON.parse(uploadedPhotosStorageData);
        numberOfUploadedPhotos = Number(parsedData.numberOfUploadedPhotos);
      }

      // if they've already used up their limit, restrict it
      if (numberOfUploadedPhotos >= maxAllowed) {
        Alert.alert('Attention', 'You have uploaded the maximum allowed number of photos. ' +
          "If it's really an important photo, please contact someone from the organization team after the game.");
      } else {
        let operations = [];
        let lastUploadedIndex;
        photos.every((photo, index) => {
          operations.push(uploadPhoto(photo));
          lastUploadedIndex = index;

          // if together with this image the user has no more photos allowed, stop the for loop
          return ((numberOfUploadedPhotos + index + 1) < maxAllowed);
        });

        // not all photos were uploaded
        if (lastUploadedIndex < photos.length - 1) {
          Alert.alert('Attention', 'To preserve the guidelines which define how many photos you can upload, ' +
            ' Not all photos will be uploaded');
        }

        // show spinner in gallery
        if (onStartCallback) {
          onStartCallback();
        }
        Promise.all(operations)
          .then(() => {
            // hide spinner in gallery
            if (onEndCallback) {
              onEndCallback();
            }
            Alert.alert('Upload Successful', 'The selected photos have been uploaded.');
            saveToStorage(
              config.storage.numberOfUploadedPhotosKey,
              JSON.stringify({numberOfUploadedPhotos: numberOfUploadedPhotos + photos.length})
            );
          })
          .catch(() => {
            Alert.alert(
              'Upload failed',
              'We are terribly sorry, but an error occurred while the photos were uploading.' +
              'This could happen sometimes due to network error, or the server is down. Please try again later.'
            );
          })

      }
    })
    .catch((error) => {
      Alert.alert('Whoops.', 'An error occurred. We are terribly sorry, but these things happen.' +
        ' Please contact someone from the organizing team, to submit your photos manually after the game.')
    });
}

/**
 * Moves an already uploaded photo, to an already created album.
 *
 * @param photoId the id of the photo
 * @param albumId the id of the album/photoset
 * @param successFn
 * @param errorFn
 */
function moveToAlbum(photoId, albumId, successFn, errorFn) {
  let queryString =
    config.flickrCredentials.apiKey.name + '=' + config.flickrCredentials.apiKey.value +
    '&' + config.flickrCredentials.authToken.name + '=' + config.flickrCredentials.authToken.value +
    '&' + config.moveToAlbum.responseFormatParam.name + '=' + config.moveToAlbum.responseFormatParam.value +
    '&' + config.moveToAlbum.methodParam.name + '=' + config.moveToAlbum.methodParam.value +
    '&' + config.moveToAlbum.noCallbackParam.name + '=' + config.moveToAlbum.noCallbackParam.value +
    '&' + config.moveToAlbum.photoIdParam.name + '=' + photoId +
    '&' + config.moveToAlbum.photosetIdParam.name + '=' + albumId;

  const signingString = config.flickrCredentials.apiSecret.value +
    queryString
      .split('&').join('')
      .split('=').join('');

  const signature = md5(signingString);
  console.log('string: ', signingString, ' signature: ', signature);

  const fullEndpoint = config.moveToAlbum.endpoint + '?' + queryString + '&' +
    config.moveToAlbum.signature.name + '=' + signature;

  console.log('initating POST call to: ', fullEndpoint);
  fetch(fullEndpoint, {method: 'POST'})
    .then((response) => response.text())
    .then((responseText) => {
      const data = JSON.parse(responseText);

      console.log('call for moving ', photoId, ' to album ', albumId, ' succeded.');
      console.log('Flickr returned status: ', data.stat, ' message: ', data.message);
      if (successFn) {
        successFn(data);
      }
    })
    .catch((error) => {
      console.log('moving ', photoId, ' to album ', albumId, ' failed.');
      if (errorFn) {
        errorFn(error);
      }
    });
}

/**
 * Retrieve details for the person with the given username.
 *
 * @param userName
 * @param successFn
 */
export function login(userName, successFn) {
  console.log('Attempting to login person with username: ', userName);
  fetch(config.login.endpoint + userName)
    .then((response) => response.text())
    .then((responseText) => {
      const data = JSON.parse(responseText);

      console.log('Login attempt resulted in response data: ', data);
      if (successFn) {
        successFn(data);
      }
    })
    .catch((err) => console.log(err));
}

/**
 * Extracts the photo id from the xml API response.
 *
 * @param xmlResponse
 * @returns {String} the photo id
 */
function extractPhotoId(xmlResponse) {
  const regex = /<photoid>([0-9]*)<\/photoid>/;
  const matched = xmlResponse.match(regex);
  return matched[1];
}
