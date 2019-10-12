import { IPosition, Position } from '../model/position.model';
import { INode } from '../model/node.model';
import { Color, getColorRgbaString } from "../model/enum/color.enum";

export class BoardService {

  ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement, private baseSize: number, private offset: number, private baseRadiuseSie: number) {
    this.ctx = canvas.getContext('2d');
  }

  public drawSquare(x: number, y: number, size: number): void {
    const finalSize = size * this.baseSize;
    const finalX = this.getRealCoordinate(x);
    const finalY = this.getRealCoordinate(y);
    this.ctx.beginPath();
    this.ctx.rect(finalX, finalY, finalSize, finalSize);
    this.ctx.stroke();
  }

  public drawLine(xStart: number, yStart: number, xEnd: number, yEnd: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(this.getRealCoordinate(xStart), this.getRealCoordinate(yStart));
    this.ctx.lineTo(this.getRealCoordinate(xEnd), this.getRealCoordinate(yEnd));
    this.ctx.stroke();
  }

  public drawNode(node: INode): void {
    this.drawNodeInCoords(node, node.x, node.y);
  }

  public drawNodeInCoords(node: INode, x: number, y: number) {
    this.drawBasicNodeInCoords(x, y, node.radius, node.color);
  }

  public writeOnCanvas(x: number, y: number, text: string) {
    this.ctx.font = this.baseSize / 2 + "px Roboto";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(text, x, y);
  }

  public drawBasicNodeInCoords(x: number, y: number, radius: number, color: Color) {
    this.ctx.beginPath();
    const finalX = this.getRealCoordinate(x);
    const finalY = this.getRealCoordinate(y);
    this.ctx.arc(finalX, finalY, radius * this.baseRadiuseSie, 0, 2 * Math.PI);
    if (color != Color.BLANK) {
      this.ctx.fillStyle = getColorRgbaString(color);
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }

  public clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public getPositionInCanvas(event: UIEvent) {
    if (event instanceof MouseEvent) {
      return this.getMousePositionInCanvas(event as MouseEvent);
    } else {
      return this.getTouchPositionInCanvas(event as TouchEvent);
    }
  }

  public getMousePositionInCanvas(evt: MouseEvent): IPosition {
    const rect = this.canvas.getBoundingClientRect();
    return new Position(
      evt.clientX - rect.left,
      evt.clientY - rect.top
    );
  }

  public getTouchPositionInCanvas(evt: TouchEvent): IPosition {
    const rect = this.canvas.getBoundingClientRect();
    return new Position(
      evt.touches[0].clientX - rect.left,
      evt.touches[0].clientY - rect.top
    );
  }

  private getRealCoordinate(val: number): number {
    return val * this.baseSize + this.offset;
  }

  public isIntersect(point: IPosition, node: INode): boolean {
    if (node.x == null || node.y == null) {
      return false;
    }

    return Math.sqrt((point.x - this.getRealCoordinate(node.x)) ** 2
      + (point.y - this.getRealCoordinate(node.y)) ** 2) < node.radius * 2 * this.baseRadiuseSie;
  }
}
