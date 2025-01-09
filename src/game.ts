"use strict";

import {
  drawText,
  engineInit,
  getCameraSize,
  mousePos,
  mouseWasPressed,
  setCameraPos,
  setPaused,
  Timer,
  vec2,
  Vector2,
} from "littlejsengine";
import Player from "./game_objects/player";
import { dropBlock, resetSprites } from "./game_state/sprites";
import {
  getLevel,
  getLives,
  getPoints,
  hasPassedLevel,
  resetScore,
  updateLives,
} from "./game_state/score";

let cameraSize: Vector2;
let player: Player;

const defaultFallTimer = 1;
let currentFallTimer = defaultFallTimer;
let fallTimer = new Timer();

const defaultFallSpeed = 0.14;
let fallSpeed = defaultFallSpeed;

let gameOver = false;
let stagePassed = false;

export function setGameOver(state: boolean) {
  gameOver = state;
  setPaused(state);
}

export function setStagePassed(state: boolean) {
  stagePassed = state;
  setPaused(state);
}

function resetState() {
  player.size = player.defaultSize;
  currentFallTimer = defaultFallTimer;
  fallTimer.set(currentFallTimer);
  fallSpeed = defaultFallSpeed;
}

function updateSpeedAndTimer() {
  currentFallTimer = currentFallTimer * 0.5;
  fallTimer.set(currentFallTimer);
  fallSpeed += 0.01;
}

///////////////////////////////////////////////////////////////////////////////
function gameInit() {
  // called once after the engine starts up
  // setup the game

  cameraSize = getCameraSize();
  setCameraPos(vec2(cameraSize.x / 2, cameraSize.y / 2));

  resetSprites(true);
  resetScore();
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {
  // called every frame at 60 frames per second
  // handle input and update the game state

  if (!player && mouseWasPressed(0)) {
    player = new Player(vec2(0, 0));
    fallTimer.set(currentFallTimer);
  } else if (!player) {
    return;
  }

  hasPassedLevel();

  if (fallTimer.elapsed()) {
    dropBlock(fallSpeed);
    fallTimer.set(currentFallTimer);
  }
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost() {
  // called after physics and objects are updated
  // setup camera and prepare for render
  if (gameOver && mouseWasPressed(0)) {
    player.pos = mousePos;
    resetSprites();
    if (getLives() == 0) {
      resetScore();
      resetState();
    } else {
      updateLives();
    }
    setGameOver(false);
  } else if (stagePassed && mouseWasPressed(0)) {
    resetSprites();
    updateSpeedAndTimer();
    setStagePassed(false);
  }
}

///////////////////////////////////////////////////////////////////////////////
function gameRender() {
  // called before objects are rendered
  // draw any background effects that appear behind objects
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost() {
  // called after objects are rendered
  // draw effects or hud that appear above all objects
  drawText(`Points: ${getPoints()}`, cameraSize.multiply(vec2(0.2, 0.9)), 1);
  drawText(`Lives: ${getLives()}`, cameraSize.multiply(vec2(0.5, 0.9)), 1);
  drawText(`Level: ${getLevel()}`, cameraSize.multiply(vec2(0.8, 0.9)), 1);
  // drawText(`Speed: ${fallSpeed}`, cameraSize.multiply(vec2(0.8, 0.05)), 1);
  // drawText(
  //   `Time: ${currentFallTimer.toFixed(0)}`,
  //   cameraSize.multiply(vec2(0.2, 0.05)),
  //   1
  // );
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);
