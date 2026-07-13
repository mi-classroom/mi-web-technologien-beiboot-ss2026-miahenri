import {
  GestureRecognizer,
  createGestureUtils,
  pinchGesture,
  fistGesture,
  thumbsUpGesture,
  thumbsDownGesture,
  bothArmsUpGesture,
  leftArmUpGesture,
  rightArmUpGesture,
} from "../../../lib/index.js";

import { initMediaPipeModels } from "./mediapipe.js";

let onGestureDetected = null;

const video = document.querySelector("#webcam");
const videoSize = {
  width: 0,
  height: 0,
};

const gestureUtils = createGestureUtils(videoSize);
const nearGestureRecognizer = new GestureRecognizer({
  requiredGestureFrames: 15,
});

const farGestureRecognizer = new GestureRecognizer({
  requiredGestureFrames: 15,
});

nearGestureRecognizer.registerGesture(pinchGesture);
nearGestureRecognizer.registerGesture(fistGesture);
nearGestureRecognizer.registerGesture(thumbsUpGesture);
nearGestureRecognizer.registerGesture(thumbsDownGesture);

farGestureRecognizer.registerGesture(bothArmsUpGesture);
farGestureRecognizer.registerGesture(leftArmUpGesture);
farGestureRecognizer.registerGesture(rightArmUpGesture);

let handLandmarker;
let poseLandmarker;
let lastVideoTime = -1;

const closePalmThreshold = 70;

async function loadTrackingModels() {
  console.log("MediaPipe wird geladen...");

  const models = await initMediaPipeModels();

  handLandmarker = models.handLandmarker;
  poseLandmarker = models.poseLandmarker;

  console.log("MediaPipe ist bereit. Kamera kann gestartet werden.");
}

export async function startCamera(handleGesture) {
  onGestureDetected = handleGesture;

  if (!handLandmarker || !poseLandmarker) {
    await loadTrackingModels();
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    video.srcObject = stream;

    video.addEventListener("loadeddata", () => {
      videoSize.width = video.videoWidth;
      videoSize.height = video.videoHeight;

      predictWebcam();
    });
  } catch (error) {
    console.error(`Kamera konnte nicht gestartet werden: ${error.message}`);
  }
}

export function getInteractionMode(results) {
  if (!results.landmarks || results.landmarks.length === 0) {
    return "no-hand";
  }

  const firstHand = results.landmarks[0];
  const palmSize = gestureUtils.getPalmSize(firstHand);
  if (palmSize >= closePalmThreshold) {
    return "near";
  }

  return "far";
}

export function predictWebcam() {
  if (!handLandmarker || !poseLandmarker) {
    requestAnimationFrame(predictWebcam);
    return;
  }

  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;

    const now = performance.now();

    const handResults = handLandmarker.detectForVideo(video, now);
    const mode = getInteractionMode(handResults);

    if (mode === "near") {
      const gestureInput = {
        hands: handResults.landmarks ?? [],
        pose: null,
        mode,
        utils: gestureUtils,
      };

      const gestureResult = nearGestureRecognizer.detect(gestureInput);

      if (gestureResult.gesture) {
        console.log("Gesture erkannt:", gestureResult);
      }

      if (onGestureDetected) {
        onGestureDetected(gestureResult);
      }

      farGestureRecognizer.reset();
    } else {
      const poseResults = poseLandmarker.detectForVideo(video, now);

      const gestureInput = {
        hands: [],
        pose: poseResults.landmarks?.[0] ?? null,
        mode,
        utils: gestureUtils,
      };

      const gestureResult = farGestureRecognizer.detect(gestureInput);

      if (gestureResult.gesture) {
        console.log("Gesture erkannt:", gestureResult);
      }

      if (onGestureDetected) {
        onGestureDetected(gestureResult);
      }

      nearGestureRecognizer.reset();
    }
  }

  requestAnimationFrame(predictWebcam);
}
