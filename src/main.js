import "./style.css";

import {
  drawHandResults,
  drawPoseResults,
} from "./demo/drawing.js";

import {
  GestureWebcamController,
  pinchGesture,
  thumbsUpGesture,
  thumbsDownGesture,
  fistGesture,
  rightArmUpGesture,
  leftArmUpGesture,
  bothArmsUpGesture,
} from "./lib/index.js";

const startButton = document.querySelector("#startButton");
const video = document.querySelector("#webcam");
const rawData = document.querySelector("#rawData");
const canvas = document.querySelector("#overlay");
const ctx = canvas.getContext("2d");
const gestureOutput = document.querySelector("#gestureOutput");
const modeOutput = document.querySelector("#modeOutput");

let gestureController = null;

startButton.addEventListener("click", async () => {
  startButton.disabled = true;
  rawData.textContent = "Gestensteuerung wird gestartet...";

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
      rightArmUpGesture,
      leftArmUpGesture,
    ],

    requiredGestureFrames: 15,
    closePalmThreshold: 70,
    requiredModeFrames: 8,
    nearGraceFrames: 15,

    onGesture: (gestureResult) => {
      updateGestureOutput(gestureResult);
    },

    onResults: (results) => {
      handleTrackingResults(results);
    },

    onError: (error) => {
      rawData.textContent =
        `Gestensteuerung konnte nicht gestartet werden: ${error.message}`;

      startButton.disabled = false;
    },
  });

  await gestureController.start();

  startButton.classList.add("hidden");
  rawData.textContent = "Gestensteuerung ist aktiv.";
});

function handleTrackingResults({
  mode,
  rawMode,
  handResults,
  poseResults,
}) {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  if (mode === "near") {
    const firstHand = handResults?.landmarks?.[0];

    if (firstHand) {
      const palmSize = gestureController.gestureUtils.getPalmSize(firstHand);

      modeOutput.textContent =
        `Aktiver Modus: ${mode} | Raw: ${rawMode} | Palm Size: ${Math.round(
          palmSize
        )}px`;
    } else {
      modeOutput.textContent =
        `Aktiver Modus: ${mode} | Raw: ${rawMode}`;
    }

    rawData.textContent = JSON.stringify(handResults, null, 2);
    drawHandResults(handResults, canvas, ctx);
    return;
  }

  if (mode === "far") {
    modeOutput.textContent = `Aktiver Modus: ${mode} | Raw: ${rawMode}`;

    rawData.textContent = JSON.stringify(poseResults, null, 2);
    drawPoseResults(poseResults, canvas, ctx);
    return;
  }

  modeOutput.textContent = `Aktiver Modus: ${mode} | Raw: ${rawMode}`;
  rawData.textContent = "Keine Hand im Bild";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateGestureOutput(gestureResult) {
  if (!gestureResult) {
    gestureOutput.textContent = "Keine Geste erkannt";
    return;
  }

  gestureOutput.textContent = gestureResult.message;
}