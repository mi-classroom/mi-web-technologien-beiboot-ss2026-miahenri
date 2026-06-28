export class GestureRecognizer {
  constructor(options = {}) {
    this.requiredGestureFrames = options.requiredGestureFrames ?? 15;

    this.currentGestureCandidate = null;
    this.gestureFrameCount = 0;
    this.stableGesture = null;
  }

  detect(results, utils) {
    if (!results.landmarks || results.landmarks.length === 0) {
      this.reset();
      return {
        status: "no-hand",
        message: "Keine Hand erkannt",
        gesture: null,
      };
    }

    const firstHand = results.landmarks[0];
    const detectedGesture = this.detectGesture(firstHand, utils);

    if (!detectedGesture) {
      this.reset();
      return {
        status: "no-gesture",
        message: "Keine Geste erkannt",
        gesture: null,
      };
    }

    if (detectedGesture.name === this.currentGestureCandidate) {
      this.gestureFrameCount += 1;
    } else {
      this.currentGestureCandidate = detectedGesture.name;
      this.gestureFrameCount = 1;
      this.stableGesture = null;
    }

    if (this.gestureFrameCount >= this.requiredGestureFrames) {
      this.stableGesture = detectedGesture.name;
    }

    return {
      status: this.stableGesture ? "stable" : "checking",
      message: this.stableGesture
        ? `${this.stableGesture} | ${detectedGesture.details}`
        : `${detectedGesture.name} wird geprüft | ${detectedGesture.details}`,
      gesture: {
        ...detectedGesture,
        stable: Boolean(this.stableGesture),
        frames: this.gestureFrameCount,
      },
    };
  }

  detectGesture(handLandmarks, utils) {
    const pinch = this.detectPinch(handLandmarks, utils);
    const fist = this.detectFist(handLandmarks, utils);

    if (pinch) {
      return pinch;
    }

    if (fist) {
      return fist;
    }

    return null;
  }

  detectPinch(handLandmarks, utils) {
    const thumbTip = handLandmarks[4];
    const indexFingerTip = handLandmarks[8];

    const distance = utils.getDistanceInPixels(thumbTip, indexFingerTip);
    const threshold = 30;

    if (distance < threshold) {
      return {
        name: "Pinch",
        isActive: true,
        details: `Abstand Daumen–Zeigefinger: ${Math.round(distance)}px`,
      };
    }

    return null;
  }

  detectFist(handLandmarks, utils) {
    const wrist = handLandmarks[0];
    const thumbTip = handLandmarks[4];
    const fingerTips = [4, 8, 12, 16, 20].map((idx) => handLandmarks[idx]);

    const distances = fingerTips.map((tip) =>
      utils.getDistanceInPixels(wrist, tip)
    );

    const distanceThumb = utils.getDistanceInPixels(
      handLandmarks[6],
      thumbTip
    );

    const averageDistance =
      distances.reduce((sum, d) => sum + d, 0) / distances.length;

    const threshold = 80;

    if (averageDistance < threshold && distanceThumb < threshold) {
      return {
        name: "Fist",
        isActive: true,
        details: `Durchschnittlicher Abstand Handgelenk–Fingerkuppen: ${Math.round(
          averageDistance
        )}px`,
      };
    }

    return null;
  }

  reset() {
    this.currentGestureCandidate = null;
    this.gestureFrameCount = 0;
    this.stableGesture = null;
  }
}