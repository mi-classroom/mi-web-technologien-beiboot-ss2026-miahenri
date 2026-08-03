function isThumbExtended(handLandmarks, utils) {
  const thumbMcp = handLandmarks[2];
  const thumbIp = handLandmarks[3];
  const thumbTip = handLandmarks[4];
  const indexMcp = handLandmarks[5];

  const palmSize = utils.getPalmSize(handLandmarks);

  const thumbTipDistanceFromIndex =
    utils.getDistanceInPixels(thumbTip, indexMcp);

  const thumbIpDistanceFromIndex =
    utils.getDistanceInPixels(thumbIp, indexMcp);

  const thumbLength =
    utils.getDistanceInPixels(thumbMcp, thumbTip);

  const thumbTipIsFurtherOutside =
    thumbTipDistanceFromIndex > thumbIpDistanceFromIndex + palmSize * 0.25;

  const thumbLongEnough =
    thumbLength > palmSize * 0.65;

  return thumbTipIsFurtherOutside && thumbLongEnough;
}

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
    const thumbMcp = handLandmarks[2];

    const indexTip = handLandmarks[8];
    const middleTip = handLandmarks[12];
    const ringTip = handLandmarks[16];
    const pinkyTip = handLandmarks[20];

    const palmSize = input.utils.getPalmSize(handLandmarks);

    const thumbExtended = isThumbExtended(handLandmarks, input.utils);

    const thumbPointsUp =
      thumbTip.y < thumbMcp.y - 0.05;

    const otherFingersFolded =
      input.utils.getDistanceInPixels(wrist, indexTip) < palmSize * 2.1 &&
      input.utils.getDistanceInPixels(wrist, middleTip) < palmSize * 2.1 &&
      input.utils.getDistanceInPixels(wrist, ringTip) < palmSize * 2.1 &&
      input.utils.getDistanceInPixels(wrist, pinkyTip) < palmSize * 2.1;

    if (thumbExtended && thumbPointsUp && otherFingersFolded) {
      return {
        isActive: true,
        details: "Daumen ist ausgestreckt und zeigt nach oben",
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