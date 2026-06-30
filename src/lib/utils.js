export function createGestureUtils(canvas) {
  return {
    getDistanceInPixels(pointA, pointB) {
      const deltaX = (pointA.x - pointB.x) * canvas.width;
      const deltaY = (pointA.y - pointB.y) * canvas.height;

      return Math.sqrt(deltaX ** 2 + deltaY ** 2);
    },

    getPalmSize(handLandmarks) {
      const wrist = handLandmarks[0];
      const indexBase = handLandmarks[5];
      const middleBase = handLandmarks[9];
      const pinkyBase = handLandmarks[17];

      const wristToMiddle = this.getDistanceInPixels(wrist, middleBase);
      const indexToPinky = this.getDistanceInPixels(indexBase, pinkyBase);

      return (wristToMiddle + indexToPinky) / 2;
    },
  };
}