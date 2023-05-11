import Color from "../variant_types/Color";

class Appearance {
  visible: boolean = true
  modulate: Color = { r: 1, g: 1, b: 1, a: 1 }

  constructor(options?: { visible?: boolean, modulate?: Color }) {
    this.visible = options?.visible
    this.modulate = options?.modulate
  }
}

export default Appearance