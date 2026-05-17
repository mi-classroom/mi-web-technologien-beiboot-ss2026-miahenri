import "./style.css";

import {
  HandLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

const startButton = document.querySelector("#startButton");
const video = document.querySelector("#webcam");
const rawData = document.querySelector("#rawData");
const canvas = document.querySelector("#overlay");
const ctx = canvas.getContext("2d");

let handLandmarker;
let lastVideoTime = -1;

const connections = [
  [0, 1], [1, 2], [2, 3], [3, 4],       // Daumen
  [0, 5], [5, 6], [6, 7], [7, 8],       // Zeigefinger
  [5, 9], [9, 10], [10, 11], [11, 12],  // Mittelfinger
  [9, 13], [13, 14], [14, 15], [15, 16],// Ringfinger
  [13, 17], [17, 18], [18, 19], [19, 20], // Kleiner Finger
  [0, 17] // Handkante
];

async function initHandLandmarker() {
  rawData.textContent = "MediaPipe wird geladen...";

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
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

function predictWebcam() {
  if (!handLandmarker) return;

  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;

    const results = handLandmarker.detectForVideo(
      video,
      performance.now()
    );

    rawData.textContent = JSON.stringify(results, null, 2);
    drawResults(results);
  }

  requestAnimationFrame(predictWebcam);
}

startButton.addEventListener("click", async () => {
  startButton.disabled = true;

  if (!handLandmarker) {
    await initHandLandmarker();
  }

  await startCamera();
});