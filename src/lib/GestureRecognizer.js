export class GestureRecognizer {
  constructor(options = {}) {
    this.requiredGestureFrames = options.requiredGestureFrames ?? 15;

    this.gestures = [];

    this.currentGestureCandidate = null;
    this.gestureFrameCount = 0;
    this.stableGesture = null;
  }

  registerGesture(gesture) {
    if (!gesture || typeof gesture !== "object") {
      throw new Error("Gesture must be an object.");
    }

    if (!gesture.id || typeof gesture.id !== "string") {
      throw new Error("Gesture must have a string id.");
    }

    if (!gesture.name || typeof gesture.name !== "string") {
      throw new Error("Gesture must have a string name.");
    }

    if (typeof gesture.detect !== "function") {
      throw new Error("Gesture must have a detect(input) function.");
    }

    const alreadyRegistered = this.gestures.some(
      (registeredGesture) => registeredGesture.id === gesture.id,
    );

    if (alreadyRegistered) {
      throw new Error(`Gesture with id "${gesture.id}" is already registered.`);
    }

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
      try {
        const result = gesture.detect(input);

        if (result) {
          return {
            id: gesture.id,
            name: gesture.name,
            ...result,
          };
        }
      } catch (error) {
        console.warn(`Gesture "${gesture.id}" failed during detection:`, error);
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
