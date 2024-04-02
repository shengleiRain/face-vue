export let userMedia = function (constraints, success, error) {
  if (navigator.mediaDevices.getUserMedia) {
    userMedia = function (constraints, success, error) {
      navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error)
    }
  } else if (navigator.webkitGetUserMedia) {
    userMedia = function (constraints, success, error) {
      navigator.webkitGetUserMedia(constraints, success, error)
    }
  } else if (navigator.mozGetUserMedia) {
    userMedia = function (constraints, success, error) {
      navigator.mozGetUserMedia(constraints, success, error)
    }
  } else if (navigator.getUserMedia) {
    userMedia = function (constraints, success, error) {
      navigator.getUserMedia(constraints, success, error)
    }
  }

  userMedia(constraints, success, error)
}
