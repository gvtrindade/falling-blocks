import { getCameraSize, randInt, vec2, Vector2 } from "littlejsengine";
import Block from "../game_objects/block";
import Cone from "../game_objects/cone";

let blocks: Block[] = [];
let positions: number[] = [];
let numPositions = 0;
let spawnedPositions: number[] = [];
let cameraSize: Vector2;

export function resetSprites(initialState = false) {
  for (let block of blocks) {
    block.destroy();
  }

  blocks = [];
  spawnedPositions = [];

  if (initialState) {
    cameraSize = getCameraSize();
    for (let x = 0.05; x < 0.95; x += 0.1) {
      new Cone(vec2(cameraSize.x * x, cameraSize.y * 0.15));
      numPositions++;
      positions.push(x);
    }
  }
}

export function dropBlock(speed: number) {
  if (spawnedPositions.length === 4) {
    spawnedPositions.shift();
  }

  let num = randInt(0, positions.length);
  while (spawnedPositions.includes(num)) {
    num = randInt(0, positions.length);
  }
  spawnedPositions.push(num);

  const block = new Block(
    vec2(cameraSize.x * positions[num], cameraSize.y * 1.1)
  );
  blocks.push(block);
  block.fall(speed);
}
