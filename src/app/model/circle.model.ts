import { Color } from "./enum/color.enum";

export interface ICircle {
  x: number;
  y: number;
  radius: number;
  color: Color;
}

export class Circle implements ICircle {
  color = Color.GRAY;

  constructor(
    public x: number,
    public y: number,
    public radius: number
  ) {
  }
}

export class HighlightedCircle implements ICircle {
  color = Color.BLANK;
  radius: number;
  x: number;
  y: number;

  constructor(
    circle: ICircle
  ) {
    this.x = circle.x;
    this.y = circle.y;
    this.radius = 2;
  }

}

export function changeColor(circle: Circle, color: Color): void {
  if (color == Color.GRAY) {
    circle.radius = 1;
  } else {
    circle.radius = 2;
  }
  circle.color = color;
}
