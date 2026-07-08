export const pinchGesture = {
  name: "Pinch",

  detect(input) {
    const handLandmarks = input.hands[0];

    if (!handLandmarks) {
      return null;
    }

    const thumbTip = handLandmarks[4];
    const indexFingerTip = handLandmarks[8];

    const distance = input.utils.getDistanceInPixels(
      thumbTip,
      indexFingerTip
    );

    const threshold = 30;

    if (distance < threshold) {
      return {
        name: "Pinch",
        isActive: true,
        details: `Abstand Daumen–Zeigefinger: ${Math.round(distance)}px`,
      };
    }

    return null;
  },
};