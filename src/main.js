import "./style.css";

import { initMediaPipeModels } from "./demo/mediapipe.js";

import { drawHandResults, drawPoseResults } from "./demo/drawing.js";

import {
  GestureRecognizer,
  createGestureUtils,
  pinchGesture,
  fistGesture,
  thumbsUpGesture,
  thumbsDownGesture,
  rightArmUpGesture,
  leftArmUpGesture,
  bothArmsUpGesture,
} from "./lib/index.js";

const startButton = document.querySelector("#startButton");
const video = document.querySelector("#webcam");
const rawData = document.querySelector("#rawData");
const canvas = document.querySelector("#overlay");
const ctx = canvas.getContext("2d");
const gestureUtils = createGestureUtils(canvas);
const gestureOutput = document.querySelector("#gestureOutput");
const modeOutput = document.querySelector("#modeOutput");
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
farGestureRecognizer.registerGesture(rightArmUpGesture);
farGestureRecognizer.registerGesture(leftArmUpGesture);

let handLandmarker;
let poseLandmarker;
let lastVideoTime = -1;

const closePalmThreshold = 70;

async function loadTrackingModels() {
  rawData.textContent = "MediaPipe wird geladen...";

  const models = await initMediaPipeModels();

  handLandmarker = models.handLandmarker;
  poseLandmarker = models.poseLandmarker;

  rawData.textContent = "MediaPipe ist bereit. Kamera kann gestartet werden.";
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    video.srcObject = stream;

    video.addEventListener("loadeddata", () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      predictWebcam();
    });
    startButton.classList.add("hidden");
  } catch (error) {
    rawData.textContent = `Kamera konnte nicht gestartet werden: ${error.message}`;
  }
}

function predictWebcam() {
  if (!handLandmarker || !poseLandmarker) return;

  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;

    const now = performance.now();

    const handResults = handLandmarker.detectForVideo(video, now);
    const mode = getInteractionMode(handResults);

    const firstHand = handResults.landmarks?.[0];

    if (firstHand) {
      const palmSize = gestureUtils.getPalmSize(firstHand);
      modeOutput.textContent = `Aktiver Modus: ${mode} | Palm Size: ${Math.round(palmSize)}px`;
    } else {
      modeOutput.textContent = `Aktiver Modus: ${mode}`;
    }

    if (mode === "near") {
      rawData.textContent = JSON.stringify(handResults, null, 2);
      drawHandResults(handResults, canvas, ctx);

      const gestureInput = {
        hands: handResults.landmarks ?? [],
        pose: null,
        mode,
        utils: gestureUtils,
      };

      const gestureResult = nearGestureRecognizer.detect(gestureInput);
      updateGestureOutput(gestureResult);

      farGestureRecognizer.reset();
    } else {
      const poseResults = poseLandmarker.detectForVideo(video, now);

      rawData.textContent = JSON.stringify(poseResults, null, 2);
      drawPoseResults(poseResults, canvas, ctx);

      const gestureInput = {
        hands: [],
        pose: poseResults.landmarks?.[0] ?? null,
        mode,
        utils: gestureUtils,
      };

      const gestureResult = farGestureRecognizer.detect(gestureInput);
      updateGestureOutput(gestureResult);

      nearGestureRecognizer.reset();
    }
  }

  requestAnimationFrame(predictWebcam);
}

startButton.addEventListener("click", async () => {
  startButton.disabled = true;

  if (!handLandmarker || !poseLandmarker) {
    await loadTrackingModels();
  }

  await startCamera();
});

function getInteractionMode(results) {
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

function updateGestureOutput(gestureResult) {
  if (!gestureResult) {
    gestureOutput.textContent = "Keine Geste erkannt";
    return;
  }

  gestureOutput.textContent = gestureResult.message;
}
