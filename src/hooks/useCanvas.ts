import type { TPointerEvent, TPointerEventInfo } from 'fabric'
import { Canvas, Circle, Line, Point } from 'fabric'
import { unrefElement } from '../utils/unrefElement'

export interface UseCanvasOptions {
  backgroundColor?: string
  width?: number
  height?: number
  radius?: number
}

export interface IPoint {
  x: number
  y: number
}

export default function useCanvas(
  target: MaybeRefOrGetter<HTMLCanvasElement | null | undefined>,
  options: UseCanvasOptions = {},
) {
  const {
    backgroundColor = '#ffffff',
    width = 800,
    height = 500,
    radius = 5,
  } = options

  const canvas = ref<Canvas>()

  const points = reactive<IPoint[]>([])

  const currentPoint = ref<Circle>()

  onMounted(initCanvas)

  function initCanvas() {
    const element = unrefElement(target)!

    canvas.value = new Canvas(element, {
      backgroundColor,
    })

    canvas.value.setDimensions({
      width,
      height,
    })

    canvas.value.on('mouse:down', createPoint)
    canvas.value.on('mouse:wheel', handleMouseWheel)
  }

  function handleMouseWheel(options: any) {
    let zoom = canvas.value!.getZoom()

    const delta = options.e.deltaY

    const point = new Point({
      x: options.e.offsetX,
      y: options.e.offsetY,
    })

    zoom *= 0.999 ** delta

    if (zoom > 20)
      zoom = 20

    if (zoom < 0.01)
      zoom = 0.01

    canvas.value?.zoomToPoint(point, zoom)
  }

  function createPoint(options: TPointerEventInfo<TPointerEvent>) {
    const { x, y } = canvas.value!.getViewportPoint(options.e)

    const circle = createCircle(x, y)

    canvas.value?.add(circle)

    if (points.length) {
      const lastPoint = points[points.length - 1]

      if (currentPoint.value)
        currentPoint.value.fill = '#60a5fa'

      const line = createLine(lastPoint.x, lastPoint.y, x, y)

      canvas.value?.add(line)

      canvas.value?.sendObjectToBack(line)
    }

    currentPoint.value = circle

    points.push({
      x,
      y,
    })
  }

  function createCircle(x: number, y: number) {
    const circle = new Circle({
      left: x - (radius / 2),
      top: y - (radius / 2),
      fill: '#1d4ed8',
      radius,
      selectable: false,
      evented: false,
      objectCaching: false,
    })

    return circle
  }

  function createLine(x1: number, y1: number, x2: number, y2: number) {
    const center = radius / 2

    const line = new Line([x1 + center, y1 + center, x2 + center, y2 + center], {
      selectable: false,
      evented: false,
      strokeWidth: 2,
      stroke: '#9ca3af',
      strokeDashArray: [5, 5],
      objectCaching: false,
    })

    return line
  }

  return {
    canvas,
    points,
  }
}
