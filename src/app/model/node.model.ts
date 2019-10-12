import { Color } from "./enum/color.enum";

export interface INode {
  x: number;
  y: number;
  radius: number;
  color: Color;
}

export class Node implements INode {
  color = Color.GRAY;

  constructor(
    public x: number,
    public y: number,
    public radius: number
  ) {
  }
}

export class HighlightedNode implements INode {
  color = Color.BLANK;
  radius: number;
  x: number;
  y: number;

  constructor(
    node: INode
  ) {
    this.x = node.x;
    this.y = node.y;
    this.radius = 2;
  }

}

export function changeColor(node: Node, color: Color): void {
  if (color == Color.GRAY) {
    node.radius = 1;
  } else {
    node.radius = 2;
  }
  node.color = color;
}
