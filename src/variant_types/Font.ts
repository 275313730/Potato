import Color from './Color';

export default interface Font {
  fontType: string;
  fontStyle: string;
  fontSize: number;
  fontWeight: number;
  fontColor: Color;
  lineHeight: number;
}
