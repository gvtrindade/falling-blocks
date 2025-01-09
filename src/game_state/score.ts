import { Timer } from "littlejsengine";
import { setStagePassed } from "../game";

let level: number;
let lives: number;
let points: number;
let pointValue: number;
let nextStagePoints: number;

let multiplierTimer = new Timer();

export function resetScore() {
  level = 1;
  lives = 3;
  points = 0;
  pointValue = 1;
  nextStagePoints = 20;
}

export function hasPassedLevel() {
  if (points >= nextStagePoints) {
    nextStagePoints = nextStagePoints * 2;
    level++;
    setStagePassed(true);
  }
}

export function addPoints(type: number) {
  let amount;
  switch (type) {
    case 1:
      amount = pointValue;
      break;
    case 2:
      amount = pointValue * 2;
      break;
    default:
      amount = pointValue;
  }
  points += amount;
}

export function updateLives() {
  if (lives > 0) {
    lives--;
  } else if (lives == 0) {
    points = 0;
    lives = 3;
  }
}

export function activateMultiplier() {
  multiplierTimer.set(5);
}

export function multiplierTimerActive() {
  return multiplierTimer.active();
}

export function getPoints() {
  return points;
}

export function getLives() {
  return lives;
}

export function addLife() {
  lives++;
}

export function getLevel() {
  return level;
}
