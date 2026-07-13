export const rightArmUpGesture = {
  id: "right-arm-up",
  name: "Right Arm Up",

  detect(input) {
    const pose = input.pose;

    if (!pose) {
      return null;
    }

    const rightShoulder = pose[12];
    const rightElbow = pose[14];
    const rightWrist = pose[16];

    if (!rightShoulder || !rightElbow || !rightWrist) {
      return null;
    }

    const wristAboveShoulder = rightWrist.y < rightShoulder.y;
    const elbowAboveShoulder = rightElbow.y < rightShoulder.y + 0.1;

    if (wristAboveShoulder && elbowAboveShoulder) {
      return {
        isActive: true,
        details: "Rechter Arm ist angehoben",
      };
    }

    return null;
  },
};

export const leftArmUpGesture = {
  id: "left-arm-up",
  name: "Left Arm Up",

  detect(input) {
    const pose = input.pose;

    if (!pose) {
      return null;
    }

    const leftShoulder = pose[11];
    const leftElbow = pose[13];
    const leftWrist = pose[15];

    if (!leftShoulder || !leftElbow || !leftWrist) {
      return null;
    }

    const wristAboveShoulder = leftWrist.y < leftShoulder.y;
    const elbowAboveShoulder = leftElbow.y < leftShoulder.y + 0.1;

    if (wristAboveShoulder && elbowAboveShoulder) {
      return {
        isActive: true,
        details: "Linker Arm ist angehoben",
      };
    }

    return null;
  },
};

export const bothArmsUpGesture = {
  id: "both-arms-up",
  name: "Both Arms Up",

  detect(input) {
    const pose = input.pose;

    if (!pose) {
      return null;
    }

    const leftShoulder = pose[11];
    const rightShoulder = pose[12];
    const leftWrist = pose[15];
    const rightWrist = pose[16];

    if (!leftShoulder || !rightShoulder || !leftWrist || !rightWrist) {
      return null;
    }

    const leftArmUp = leftWrist.y < leftShoulder.y;
    const rightArmUp = rightWrist.y < rightShoulder.y;

    if (leftArmUp && rightArmUp) {
      return {
        isActive: true,
        details: "Beide Arme sind angehoben",
      };
    }

    return null;
  },
};