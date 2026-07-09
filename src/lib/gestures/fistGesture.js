export const fistGesture = {
  id: "fist",
  name: "Fist",

  detect(input) {
    const handLandmarks = input.hands[0];

    if (!handLandmarks) {
      return null;
    }

    const wrist = handLandmarks[0];
    const thumbTip = handLandmarks[4];
    const fingerTips = [4, 8, 12, 16, 20].map(
      (idx) => handLandmarks[idx]
    );

    const distances = fingerTips.map((tip) =>
      input.utils.getDistanceInPixels(wrist, tip)
    );

    const distanceThumb = input.utils.getDistanceInPixels(
      handLandmarks[6],
      thumbTip
    );

    const averageDistance =
      distances.reduce((sum, distance) => sum + distance, 0) /
      distances.length;

    const threshold = 80;

    if (averageDistance < threshold && distanceThumb < threshold) {
      return {
        isActive: true,
        details: `Durchschnittlicher Abstand Handgelenk–Fingerkuppen: ${Math.round(
          averageDistance
        )}px`,
      };
    }

    return null;
  },
};