export const thumbsUpGesture = {
  id: "thumbs-up",
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
        isActive: true,
        details: "Daumen zeigt nach oben, andere Finger sind eingeklappt",
      };
    }

    return null;
  },
};

export const thumbsDownGesture = {
  id: "thumbs-down",
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
        isActive: true,
        details: "Daumen zeigt nach unten, andere Finger sind eingeklappt",
      };
    }

    return null;
  },
};