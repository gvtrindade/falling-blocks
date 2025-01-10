import { getCameraSize, randInt, vec2, Vector2 } from "littlejsengine";
import Block from "../game_objects/block";
import Cone from "../game_objects/cone";

let blocks: Block[] = [];
let xPositions: number[] = [];
let numXPositions = 0;
let spawnedPositions: number[] = [];
let firstConeX = 1.5;
const coneSpacing = 0.3;
const coneSize = 2.5;

let cameraSize: Vector2;

export function resetSprites(initialState = false) {
  for (let block of blocks) {
    block.destroy();
  }

  blocks = [];
  spawnedPositions = [];

  if (initialState) {
    cameraSize = getCameraSize();
    xPositions.push(firstConeX);
    let numCones = populateLineWithBlocks(
      firstConeX,
      coneSpacing,
      coneSize,
      cameraSize.x
    );

    for (let x = 0; x < numCones; x++) {
      new Cone(vec2(firstConeX, cameraSize.y * 0.15), coneSize);
      firstConeX += coneSize + coneSpacing;
      xPositions.push(firstConeX);
    }

    numXPositions = xPositions.length;
    console.log(xPositions)
  }
}

function populateLineWithBlocks(
  margin: number,
  spacing: number,
  coneSize: number,
  availableWidth: number
) {
  let numBlocks = 0;
  let totalWidth = 0;

  availableWidth -= margin * 2;

  while (totalWidth <= availableWidth) {
    totalWidth += coneSize + spacing;
    numBlocks++;
  }
  
  numBlocks++;

  return numBlocks;
}

export function dropBlock(speed: number) {
  if (spawnedPositions.length === 4) {
    spawnedPositions.shift();
  }

  let num = randInt(0, numXPositions);
  while (spawnedPositions.includes(num)) {
    num = randInt(0, numXPositions);
  }
  spawnedPositions.push(num);

  const block = new Block(
    vec2(xPositions[num], cameraSize.y * 1.1)
  );
  blocks.push(block);
  block.fall(speed);
}
