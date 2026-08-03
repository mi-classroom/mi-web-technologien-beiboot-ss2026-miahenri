import { initMediaPipeModels } from "./mediapipe.js";
import { GestureRecognizer } from "../GestureRecognizer.js";
import { createGestureUtils } from "../utils.js";

export class GestureWebcamController {
  constructor({
    videoElement,
    nearGestures = [],
    farGestures = [],
    requiredGestureFrames = 15,
    closePalmThreshold = 70,
    requiredModeFrames = 8,
    nearGraceFrames = 15,
    onGesture = null,
    onModeChange = null,
    onResults = null,
    onError = null,
  }) {
    this.videoElement = videoElement;

    this.nearGestures = nearGestures;
    this.farGestures = farGestures;

    this.requiredGestureFrames = requiredGestureFrames;
    this.closePalmThreshold = closePalmThreshold;
    this.requiredModeFrames = requiredModeFrames;
    this.nearGraceFrames = nearGraceFrames;

    this.onGesture = onGesture;
    this.onModeChange = onModeChange;
    this.onResults = onResults;
    this.onError = onError;

    this.handLandmarker = null;
    this.poseLandmarker = null;

    this.lastVideoTime = -1;
    this.animationFrameId = null;

    this.currentInteractionMode = "no-hand";
    this.modeCandidate = "no-hand";
    this.modeCandidateFrames = 0;
    this.framesSinceNearHand = 0;

    this.videoSize = {
      width: 0,
      height: 0,
    };

    this.gestureUtils = createGestureUtils(this.videoSize);

    this.nearGestureRecognizer = new GestureRecognizer({
      requiredGestureFrames,
    });

    this.farGestureRecognizer = new GestureRecognizer({
      requiredGestureFrames,
    });

    this.nearGestures.forEach((gesture) => {
      this.nearGestureRecognizer.registerGesture(gesture);
    });

    this.farGestures.forEach((gesture) => {
      this.farGestureRecognizer.registerGesture(gesture);
    });
  }

  async start() {
    if (!this.videoElement) {
      this.handleError(new Error("Kein videoElement übergeben."));
      return;
    }

    try {
      const models = await initMediaPipeModels();

      this.handLandmarker = models.handLandmarker;
      this.poseLandmarker = models.poseLandmarker;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      this.videoElement.srcObject = stream;

      this.videoElement.addEventListener("loadeddata", () => {
        this.updateVideoSize();
        this.predictWebcam();
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const stream = this.videoElement?.srcObject;

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    this.videoElement.srcObject = null;
  }

  predictWebcam() {
    if (!this.handLandmarker || !this.poseLandmarker) {
      this.animationFrameId = requestAnimationFrame(() => this.predictWebcam());
      return;
    }

    if (this.videoElement.currentTime !== this.lastVideoTime) {
      this.lastVideoTime = this.videoElement.currentTime;
      this.updateVideoSize();

      const now = performance.now();

      const handResults = this.handLandmarker.detectForVideo(
        this.videoElement,
        now,
      );

      const previousMode = this.currentInteractionMode;

      const rawMode = this.getRawInteractionMode(handResults);
      const mode = this.getStableInteractionMode(rawMode);

      if (mode !== previousMode && this.onModeChange) {
        this.onModeChange(mode, rawMode);
      }

      if (mode === "near") {
        this.handleNearMode(handResults, mode, rawMode);
      } else if (mode === "far") {
        const poseResults = this.poseLandmarker.detectForVideo(
          this.videoElement,
          now,
        );

        this.handleFarMode(poseResults, mode, rawMode);
      } else {
        this.handleNoGesture(mode, rawMode);
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.predictWebcam());
  }

  handleNearMode(handResults, mode, rawMode) {
    const gestureInput = {
      hands: handResults.landmarks ?? [],
      pose: null,
      mode,
      rawMode,
      utils: this.gestureUtils,
    };

    const gestureResult = this.nearGestureRecognizer.detect(gestureInput);

    this.farGestureRecognizer.reset();

    this.emitResults({
      mode,
      rawMode,
      handResults,
      poseResults: null,
      gestureResult,
    });

    this.emitGesture(gestureResult);
  }

  handleFarMode(poseResults, mode, rawMode) {
    const gestureInput = {
      hands: [],
      pose: poseResults.landmarks?.[0] ?? null,
      mode,
      rawMode,
      utils: this.gestureUtils,
    };

    const gestureResult = this.farGestureRecognizer.detect(gestureInput);

    this.nearGestureRecognizer.reset();

    this.emitResults({
      mode,
      rawMode,
      handResults: null,
      poseResults,
      gestureResult,
    });

    this.emitGesture(gestureResult);
  }

  handleNoGesture(mode, rawMode) {
    this.nearGestureRecognizer.reset();
    this.farGestureRecognizer.reset();

    const gestureResult = {
      status: "no-gesture",
      message: "Keine Geste erkannt",
      gesture: null,
    };

    this.emitResults({
      mode,
      rawMode,
      handResults: null,
      poseResults: null,
      gestureResult,
    });

    this.emitGesture(gestureResult);
  }

  getRawInteractionMode(handResults) {
    if (!handResults.landmarks || handResults.landmarks.length === 0) {
      return "no-hand";
    }

    const firstHand = handResults.landmarks[0];
    const palmSize = this.gestureUtils.getPalmSize(firstHand);

    if (palmSize >= this.closePalmThreshold) {
      return "near";
    }

    return "far";
  }

  getStableInteractionMode(rawMode) {
    if (rawMode === "near") {
      this.framesSinceNearHand = 0;
    } else {
      this.framesSinceNearHand += 1;
    }

    if (
      this.currentInteractionMode === "near" &&
      rawMode !== "near" &&
      this.framesSinceNearHand < this.nearGraceFrames
    ) {
      return "near";
    }

    if (rawMode === this.modeCandidate) {
      this.modeCandidateFrames += 1;
    } else {
      this.modeCandidate = rawMode;
      this.modeCandidateFrames = 1;
    }

    if (this.modeCandidateFrames >= this.requiredModeFrames) {
      this.currentInteractionMode = this.modeCandidate;
    }

    return this.currentInteractionMode;
  }

  updateVideoSize() {
    this.videoSize.width = this.videoElement.videoWidth;
    this.videoSize.height = this.videoElement.videoHeight;
  }

  emitGesture(gestureResult) {
    if (this.onGesture) {
      this.onGesture(gestureResult);
    }
  }

  emitResults(results) {
    if (this.onResults) {
      this.onResults(results);
    }
  }

  handleError(error) {
    if (this.onError) {
      this.onError(error);
    } else {
      console.error(error);
    }
  }
}
