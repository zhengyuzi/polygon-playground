import { Rect } from 'fabric'

export interface WorkspaceOption {
  width: number
  height: number
  left: number
  top: number
  fill: string
}

export class Workspace {
  canvas: Rect

  constructor(options: WorkspaceOption) {
    const {
      width,
      height,
      left,
      top,
      fill,
    } = options

    this.canvas = new Rect({
      width,
      height,
      left,
      top,
      fill,
      selectable: false,
      hasControls: false,
      hoverCursor: 'default',
    })
  }
}
