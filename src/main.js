import "./style.css";

import {
  HandLandmarker,
  PoseLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

import { GestureRecognizer } from "./lib/GestureRecognizer.js";
import { pinchGesture, fistGesture } from "./lib/gestures.js";
import { createGestureUtils } from "./lib/utils.js";

const startButton = document.querySelector("#startButton");
const video = document.querySelector("#webcam");
const rawData = document.querySelector("#rawData");
const canvas = document.querySelector("#overlay");
const ctx = canvas.getContext("2d");
const gestureUtils = createGestureUtils(canvas);
const gestureOutput = document.querySelector("#gestureOutput");
const modeOutput = document.querySelector("#modeOutput");
const gestureRecognizer = new GestureRecognizer({
  requiredGestureFrames: 15,
});

gestureRecognizer.registerGesture(pinchGesture);
gestureRecognizer.registerGesture(fistGesture);

let handLandmarker;
let poseLandmarker;
let lastVideoTime = -1;

const connections = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4], // Daumen
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8], // Zeigefinger
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12], // Mittelfinger
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16], // Ringfinger
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20], // Kleiner Finger
  [0, 17], // Handkante
];

const closePalmThreshold = 70;

async function initPoseLandmarker(vision) {
  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numPoses: 1,
  });
}

async function initMediaPipe() {
  rawData.textContent = "MediaPipe wird geladen...";

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm",
  );

  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numHands: 2,
  });

  await initPoseLandmarker(vision);

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

function drawResults(results) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!results.landmarks || results.landmarks.length === 0) {
    return;
  }

  for (const hand of results.landmarks) {
    // Linien zeichnen
    ctx.strokeStyle = "rgba(228, 200, 253, 0.99)";
    ctx.lineWidth = 2;

    for (const [startIdx, endIdx] of connections) {
      const start = hand[startIdx];
      const end = hand[endIdx];

      ctx.beginPath();
      ctx.moveTo(start.x * canvas.width, start.y * canvas.height);
      ctx.lineTo(end.x * canvas.width, end.y * canvas.height);
      ctx.stroke();
    }

    // Punkte zeichnen
    ctx.fillStyle = "rgba(26, 85, 231, 0.91)";

    for (const point of hand) {
      const x = point.x * canvas.width;
      const y = point.y * canvas.height;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

function drawPoseResults(results) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!results.landmarks || results.landmarks.length === 0) {
    return;
  }

  const pose = results.landmarks[0];

  ctx.fillStyle = "rgba(255, 180, 80, 0.95)";

  for (const point of pose) {
    const x = point.x * canvas.width;
    const y = point.y * canvas.height;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
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
      drawResults(handResults);

      const gestureInput = {
        hands: handResults.landmarks ?? [],
        mode,
        utils: gestureUtils,
      };

      const gestureResult = gestureRecognizer.detect(gestureInput);
      updateGestureOutput(gestureResult);
    } else if (mode === "far") {
      const poseResults = poseLandmarker.detectForVideo(video, now);

      rawData.textContent = JSON.stringify(poseResults, null, 2);
      drawPoseResults(poseResults);

      gestureRecognizer.reset();
      gestureOutput.textContent =
        "Distanzmodus aktiv: Körperdaten werden ausgewertet.";
    } else if (mode === "no-hand") {
      const poseResults = poseLandmarker.detectForVideo(video, now);

      rawData.textContent = JSON.stringify(poseResults, null, 2);
      drawPoseResults(poseResults);

      gestureRecognizer.reset();
      gestureOutput.textContent = "Keine nahe Hand erkannt. Körpermodus aktiv.";
    }
  }

  requestAnimationFrame(predictWebcam);
}

startButton.addEventListener("click", async () => {
  startButton.disabled = true;

  if (!handLandmarker || !poseLandmarker) {
    await initMediaPipe();
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
