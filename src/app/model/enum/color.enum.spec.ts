import { async } from '@angular/core/testing';
import { Color, getColorRgbaString, getOpponentColor } from './color.enum'

describe('Color Enum', () => {
  it('Should return GOLD rgba', async(() => {
    const gold = Color.GOLD;
    expect(getColorRgbaString(gold)).toEqual('rgba(255,215,0)')
  }));
  it('Should return BLUE rgba', async(() => {
    const blue = Color.BLUE;
    expect(getColorRgbaString(blue)).toEqual('rgba(32,178,170)')
  }));
  it('Should return GRAY rgba', async(() => {
    const gray = Color.GRAY;
    expect(getColorRgbaString(gray)).toEqual('rgba(119,136,153)')
  }));
  it('Should return BLANK', async(() => {
    const blank = Color.BLANK;
    expect(getColorRgbaString(blank)).toEqual('')
  }));
});

describe('Opponent Color', () => {
  it('should return GOLD to BLUE', async(() => {
    const player1 = Color.GOLD;
    expect(getOpponentColor(player1)).toEqual(Color.BLUE)
  }));
  it('should return BLUE to GOLD', async(() => {
    const player2 = Color.BLUE;
    expect(getOpponentColor(player2)).toEqual(Color.GOLD)
  }));
});
