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

export const fistGesture = {
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
        name: "Fist",
        isActive: true,
        details: `Durchschnittlicher Abstand Handgelenk–Fingerkuppen: ${Math.round(
          averageDistance
        )}px`,
      };
    }

    return null;
  },
};

export const thumbsUpGesture = {
  name: "Thumbs Up",

  detect(input) {
    const handLandmarks = input.hands[0];

    if (!handLandmarks) {
      return null;
    }

    const wrist = handLandmarks[0];

    const thumbTip = handLandmarks[4];
    const thumbKnuckle = handLandmarks[3];

    const indexTip = handLandmarks[8];
    const middleTip = handLandmarks[12];
    const ringTip = handLandmarks[16];
    const pinkyTip = handLandmarks[20];

    const palmSize = input.utils.getPalmSize(handLandmarks);

    const thumbPointsUp = thumbTip.y < thumbKnuckle.y - 0.05;

    const otherFingersCloseToPalm = [
      indexTip,
      middleTip,
      ringTip,
      pinkyTip,
    ].every((tip) => {
      const distance = input.utils.getDistanceInPixels(wrist, tip);
      return distance < palmSize * 2;
    });

    if (thumbPointsUp && otherFingersCloseToPalm) {
      return {
        name: "Thumbs Up",
        isActive: true,
        details: "Daumen zeigt nach oben, andere Finger sind eingeklappt",
      };
    }

    return null;
  },
};

export const thumbsDownGesture = {
  name: "Thumbs Down",

  detect(input) {
    const handLandmarks = input.hands[0];

    if (!handLandmarks) {
      return null;
    }

    const wrist = handLandmarks[0];

    const thumbTip = handLandmarks[4];
    const thumbKnuckle = handLandmarks[3];

    const indexTip = handLandmarks[8];
    const middleTip = handLandmarks[12];
    const ringTip = handLandmarks[16];
    const pinkyTip = handLandmarks[20];

    const palmSize = input.utils.getPalmSize(handLandmarks);

    const thumbPointsDown = thumbTip.y > thumbKnuckle.y + 0.05;

    const otherFingersCloseToPalm = [
      indexTip,
      middleTip,
      ringTip,
      pinkyTip,
    ].every((tip) => {
      const distance = input.utils.getDistanceInPixels(wrist, tip);
      return distance < palmSize * 2;
    });

    if (thumbPointsDown && otherFingersCloseToPalm) {
      return {
        name: "Thumbs Down",
        isActive: true,
        details: "Daumen zeigt nach unten, andere Finger sind eingeklappt",
      };
    }

    return null;
  },
};