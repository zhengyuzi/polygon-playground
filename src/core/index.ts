import type { CanvasOptions, TOptions, TPointerEvent, TPointerEventInfo } from 'fabric'
import { Canvas } from 'fabric'
import { Workspace } from './workspace'

export class PPCanvas extends Canvas {
  workspace: Workspace

  constructor(el?: string | HTMLCanvasElement, options?: TOptions<CanvasOptions>) {
    super(el, options)

    this.workspace = new Workspace({
      left: this.width / 2,
      top: this.height / 2,
      width: 800,
      height: 500,
      fill: 'white',
    })

    this.add(this.workspace.canvas)
    this.sendObjectToBack(this.workspace.canvas)
    this.openDraw()
  }

  createPoint(x: number, y: number) {
    //
  }

  drawHandler(options: TPointerEventInfo<TPointerEvent>) {
    const { x, y } = this.getViewportPoint(options.e)
    this.createPoint(x, y)
  }

  openDraw() {
    this.workspace.on('mousedown', this.drawHandler)
  }

  closeDraw() {
    this.workspace.off('mousedown', this.drawHandler)
  }
}
