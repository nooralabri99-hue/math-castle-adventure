export const arabic = (n) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
export const challenges = [
  { number: 24, multiplier: 10, choices: [240, 2400, 34] },
  { number: 36, multiplier: 100, choices: [360, 3600, 136] },
  { number: 125, multiplier: 10, choices: [1250, 12500, 135] },
  { number: 208, multiplier: 100, choices: [2080, 308, 20800] },
  { number: 470, multiplier: 10, choices: [47000, 4700, 480] },
];
export const isCorrect = (challenge, answer) =>
  challenge.number * challenge.multiplier === answer;
export const doors = [-12, -6, 0, 6, 12].map((x, i) => ({
  x,
  z: -9,
  color: ["#a78bfa", "#38bdf8", "#fbbf24", "#fb7185", "#34d399"][i],
}));
