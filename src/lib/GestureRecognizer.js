export class GestureRecognizer {
  constructor(options = {}) {
    this.requiredGestureFrames = options.requiredGestureFrames ?? 15;

    this.gestures = [];

    this.currentGestureCandidate = null;
    this.gestureFrameCount = 0;
    this.stableGesture = null;
  }

  registerGesture(gesture) {
    this.gestures.push(gesture);
  }

  detect(input) {
    const detectedGesture = this.findGesture(input);

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

    const isStable = Boolean(this.stableGesture);

    return {
      status: isStable ? "stable" : "checking",
      message: isStable
        ? `${detectedGesture.name} | ${detectedGesture.details}`
        : `${detectedGesture.name} wird geprüft | ${detectedGesture.details}`,
      gesture: {
        ...detectedGesture,
        stable: isStable,
        frames: this.gestureFrameCount,
      },
    };
  }

  findGesture(input) {
    for (const gesture of this.gestures) {
      const result = gesture.detect(input);

      if (result) {
        return result;
      }
    }

    return null;
  }

  reset() {
    this.currentGestureCandidate = null;
    this.gestureFrameCount = 0;
    this.stableGesture = null;
  }
}