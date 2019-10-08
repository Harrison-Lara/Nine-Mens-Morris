export enum Color {
  GOLD = 'GOLD', BLUE = 'BLUE', GRAY = 'GRAY', BLANK = 'BLANK'
}

export function getColorRgbaString(color: Color): string {
  switch (color) {
    case Color.GOLD:
      return 'rgba(255,215,0)';
    case Color.BLUE:
      return 'rgba(32,178,170)';
    case Color.GRAY:
      return 'rgba(119,136,153)';
    case Color.BLANK:
      return '';
  }
}

export function getOpponentColor(turn: Color): Color {
  switch (turn) {
    case Color.GOLD:
      return Color.BLUE;
    case Color.BLUE:
      return Color.GOLD;
  }
}
