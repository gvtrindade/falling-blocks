"use strict";

import { Color, EngineObject, randInt, vec2, Vector2 } from "littlejsengine";
import Player from "./player";
import { setGameOver } from "../game";
import {
  activateMultiplier,
  addLife,
  addPoints,
  multiplierTimerActive,
} from "../game_state/score";
import Cone from "./cone";

class Block extends EngineObject {
  pointCounted = false;
  isDoubleValue = false;
  isMultiplier = false;
  isBigger = false;
  isSmaller = false;
  isShield = false;
  isLife = false;

  constructor(pos: Vector2) {
    super(pos, vec2(2, 2));

    this.setCollision();
    this.setType();
  }

  setType(): void {
    const rand = randInt(0, 1000);
    switch (true) {
      case rand < 50: // Double Value
        this.color = new Color(1, 0, 0);
        this.isDoubleValue = true;
        break;
      case rand >= 100 && rand <= 120: // Multiplier
        this.color = new Color(0, 1, 0);
        this.isMultiplier = true;
        break;
      case rand >= 200 && rand <= 220: // Bigger
        this.color = new Color(0, 0, 1);
        this.isBigger = true;
        break;
      case rand >= 300 && rand <= 320: // Smaller
        this.color = new Color(1, 0, 1);
        this.isSmaller = true;
        break;
      case rand >= 400 && rand <= 420: // Shield
        this.color = new Color(1, 1, 0);
        this.isShield = true;
        break;
      case rand >= 500 && rand <= 505: // Life
        this.color = new Color(0, 1, 1);
        this.isLife = true;
        break;
      default:
        this.color = new Color(1, 1, 1);
    }
  }

  collideWithObject(object: EngineObject): boolean {
    if (object instanceof Cone && !this.pointCounted) {
      this.velocity = vec2(0, 0);
      this.mass = 0;
      this.pointCounted = true;
      addPoints(multiplierTimerActive() ? 2 : 1);
    }

    if (object instanceof Block && this.pointCounted) {
      this.destroy();
    }

    if (object instanceof Player) {
      this.collideWithPlayer(object);
    }

    return false;
  }

  collideWithPlayer(player: Player): void {
    if (this.isPowerUp() && !this.pointCounted) {
      if (this.isDoubleValue) {
        addPoints(2);
      } else if (this.isMultiplier) {
        activateMultiplier();
      } else if (this.isLife) {
        addLife();
      }
      this.destroy();
      return;
    } else if (player.shieldTimer.active() && !this.pointCounted) {
      return;
    }

    setGameOver(true);
  }

  isPowerUp(): boolean {
    return (
      this.isDoubleValue ||
      this.isMultiplier ||
      this.isBigger ||
      this.isSmaller ||
      this.isShield ||
      this.isLife
    );
  }

  fall(speed: number = 0.1): void {
    this.velocity = vec2(0, -speed);
  }
}

export default Block;
