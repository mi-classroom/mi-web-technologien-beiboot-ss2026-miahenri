export const pinchGesture = {
  id: "pinch",
  name: "Pinch",

  detect(input) {
    const handLandmarks = input.hands[0];

    if (!handLandmarks) {
      return null;
    }

    const thumbTip = handLandmarks[4];
    const indexFingerTip = handLandmarks[8];

    const palmSize = input.utils.getPalmSize(handLandmarks);

    const distance = input.utils.getDistanceInPixels(
      thumbTip,
      indexFingerTip
    );

    const threshold = palmSize * 0.45;

    if (distance < threshold) {
      return {
        isActive: true,
        details: `Abstand Daumen–Zeigefinger: ${Math.round(
          distance
        )}px | Schwellenwert: ${Math.round(threshold)}px`,
      };
    }

    return null;
  },
};