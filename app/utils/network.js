export function uploadPhoto(endpoint, image, successCallback, errorCallback, onProgressCallback) {
  const xhr = new XMLHttpRequest();

  xhr.open('POST', endpoint);
  xhr.onload = () => {
    if (xhr.status !== 200) {
      console.log('upload of image:', image.name, ' failed with status: ', xhr.status);
      if (errorCallback) {
        errorCallback(xhr.status);
      }

      return;
    }

    console.log('upload of image: ', image.name, ' succeeded');
    if (successCallback) {
      successCallback();
    }
  };

  const imageObj = {
    uri: image.uri,
    type: 'image/jpeg',
    name: image.name
  };


  const formData = new FormData();
  formData.append('image', imageObj);
  if (xhr.upload) {
    xhr.upload.onprogress = (event) => {
      console.log('upload onprogress', event);
      if (event.lengthComputable) {
        if (onProgressCallback) {
          onProgressCallback(Math.round((event.loaded / event.total) * 100));
        }
      }
    };
  }
  xhr.send(formData);
}