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

export const fistGesture = {
  id: "fist",
  name: "Fist",

  detect(input) {
    const handLandmarks = input.hands[0];

    if (!handLandmarks) {
      return null;
    }

    const wrist = handLandmarks[0];

    const indexTip = handLandmarks[8];
    const middleTip = handLandmarks[12];
    const ringTip = handLandmarks[16];
    const pinkyTip = handLandmarks[20];

    const palmSize = input.utils.getPalmSize(handLandmarks);

    const thumbExtended = isThumbExtended(handLandmarks, input.utils);

    const fingersFolded =
      input.utils.getDistanceInPixels(wrist, indexTip) < palmSize * 2.1 &&
      input.utils.getDistanceInPixels(wrist, middleTip) < palmSize * 2.1 &&
      input.utils.getDistanceInPixels(wrist, ringTip) < palmSize * 2.1 &&
      input.utils.getDistanceInPixels(wrist, pinkyTip) < palmSize * 2.1;

    if (fingersFolded && !thumbExtended) {
      return {
        isActive: true,
        details: "Finger sind eingeklappt, Daumen ist nicht ausgestreckt",
      };
    }

    return null;
  },
};