const connections = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4], // Daumen
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8], // Zeigefinger
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12], // Mittelfinger
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16], // Ringfinger
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20], // Kleiner Finger
  [0, 17], // Handkante
];

export function drawHandResults(results, canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!results.landmarks || results.landmarks.length === 0) {
    return;
  }

  for (const hand of results.landmarks) {
    // Linien zeichnen
    ctx.strokeStyle = "rgba(228, 200, 253, 0.99)";
    ctx.lineWidth = 2;

    for (const [startIdx, endIdx] of connections) {
      const start = hand[startIdx];
      const end = hand[endIdx];

      ctx.beginPath();
      ctx.moveTo(start.x * canvas.width, start.y * canvas.height);
      ctx.lineTo(end.x * canvas.width, end.y * canvas.height);
      ctx.stroke();
    }

    // Punkte zeichnen
    ctx.fillStyle = "rgba(26, 85, 231, 0.91)";

    for (const point of hand) {
      const x = point.x * canvas.width;
      const y = point.y * canvas.height;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

export function drawPoseResults(results, canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!results.landmarks || results.landmarks.length === 0) {
    return;
  }

  const pose = results.landmarks[0];

  ctx.fillStyle = "rgba(255, 180, 80, 0.95)";

  for (const point of pose) {
    const x = point.x * canvas.width;
    const y = point.y * canvas.height;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}