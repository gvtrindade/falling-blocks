"use strict";

import { Color, EngineObject, vec2, Vector2 } from "littlejsengine";

class Cone extends EngineObject {
  constructor(pos: Vector2, size: number) {
    super(pos, vec2(size, size));

    this.color = new Color(1, 0, 1);
    this.mass = 0;
    this.setCollision();
  }
}

export default Cone;
