"use strict";

import {
  Color,
  EngineObject,
  mousePos,
  Timer,
  vec2,
  Vector2,
} from "littlejsengine";
import Block from "./block";

class Player extends EngineObject {
  hasSizeAltered = false;
  defaultSize = vec2(1, 3);
  sizeTimer = new Timer();
  shieldTimer = new Timer();

  constructor(pos: Vector2) {
    super(pos, vec2(1, 3));

    this.setCollision();
    this.mass = 0;
    this.color = new Color(255, 0, 0);
  }

  update(): void {
    super.update();
    this.pos = mousePos;

    if (this.hasSizeAltered && this.sizeTimer.elapsed()) {
      this.hasSizeAltered = false;
      this.size = this.defaultSize;
    }
  }

  collideWithObject(object: EngineObject): boolean {
    if (object instanceof Block) {
      if (object.isShield) {
        this.shieldTimer.set(5);
      } else if (
        (object.isBigger || object.isSmaller) &&
        !this.hasSizeAltered
      ) {
        this.alterSize(object);
      }
    }

    return false;
  }

  alterSize(object: Block): void {
    if (object.isSmaller) {
      this.size = this.defaultSize.multiply(vec2(0.7, 0.7));
    } else if (object.isBigger) {
      this.size = this.defaultSize.multiply(vec2(1.3, 1.3));
    }
    this.hasSizeAltered = true;
    this.sizeTimer.set(5);
    object.destroy();
  }
}

export default Player;
