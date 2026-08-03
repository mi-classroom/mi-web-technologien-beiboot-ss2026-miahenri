import {
  GestureWebcamController,
  pinchGesture,
  fistGesture,
  thumbsUpGesture,
  thumbsDownGesture,
  bothArmsUpGesture,
  leftArmUpGesture,
  rightArmUpGesture,
} from "../../../lib/index.js";

let gestureController = null;

export async function startCamera(handleGesture) {
  const video = document.querySelector("#webcam");

  gestureController = new GestureWebcamController({
    videoElement: video,

    nearGestures: [
      pinchGesture,
      thumbsUpGesture,
      thumbsDownGesture,
      fistGesture,
    ],

    farGestures: [
      bothArmsUpGesture,
      leftArmUpGesture,
      rightArmUpGesture,
    ],

    requiredGestureFrames: 15,
    closePalmThreshold: 70,
    requiredModeFrames: 8,
    nearGraceFrames: 15,

    onGesture: (gestureResult) => {
      handleGesture(gestureResult);
    },

    onResults: ({ mode, rawMode, gestureResult }) => {
      if (gestureResult.gesture?.justBecameStable) {
        console.log({
          mode,
          rawMode,
          gesture: gestureResult.gesture.id,
          status: gestureResult.status,
        });
      }
    },

    onError: (error) => {
      console.error(
        `Gestensteuerung konnte nicht gestartet werden: ${error.message}`
      );
    },
  });

  await gestureController.start();
}

export function stopCamera() {
  if (gestureController) {
    gestureController.stop();
    gestureController = null;
  }
}