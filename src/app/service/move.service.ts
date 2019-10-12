import { BoardService } from "./board.service";
import { Color } from "../model/enum/color.enum";

export class MoveService {

  BoardService: BoardService;

  constructor(private canvas: HTMLCanvasElement, private baseSize: number, private offset: number, public numberOfPieces, private color: Color, private radiusSize: number, private baseRadiusSize: number) {
    this.BoardService = new BoardService(canvas, baseSize, offset, baseRadiusSize);
    this.canvas.width = (this.baseSize) * 2;
    this.canvas.height = this.offset * 2;
  }

  drawDrawer() {
    this.BoardService.clearCanvas();

    this.BoardService.writeOnCanvas(this.offset / 2, this.offset * 1.25, this.numberOfPieces + " x");
    this.BoardService.drawBasicNodeInCoords(1, 0, this.radiusSize, this.color);
  }
}
