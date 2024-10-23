import type { Point, TPointerEvent, TPointerEventInfo } from 'fabric'
import { useResizeObserver } from '@vueuse/core'
import { Canvas, Circle, Line, Rect } from 'fabric'
import { unrefElement } from '../utils/unrefElement'

export interface UseCanvasOptions {
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
    radius = 5,
  } = options

  const canvas = ref<Canvas>()

  const points = reactive<IPoint[]>([])

  const currentPoint = reactive<{ circle: Circle | undefined, line: Line | undefined }>({
    circle: undefined,
    line: undefined,
  })

  const zoom = ref(1)

  const dragMove = reactive({
    isDrag: false,
    lastPosX: 0,
    lastPosY: 0,
  })

  onMounted(() => {
    const element = unrefElement(target)!

    canvas.value = new Canvas(element, {
      selection: false,
    })

    // const rect = new Rect({
    //   left: (document.body.clientWidth - 800) / 2,
    //   top: (document.body.clientHeight - 64 - 500) / 2,
    //   width: 800,
    //   height: 500,
    //   fill: 'white',
    //   selectable: false,
    // })

    useResizeObserver(canvas.value.wrapperEl.parentElement, (entries) => {
      const entry = entries[0]
      const { width, height } = entry.contentRect
      canvas.value?.setDimensions({ width, height })
    })

    openDraw()
    openMouseWheel()
  })

  onUnmounted(() => {
    canvas.value?.dispose()
  })

  function clear() {
    canvas.value?.clear()
    points.length = 0
    currentPoint.circle = undefined
    currentPoint.line = undefined
  }

  function createPoint(options: TPointerEventInfo<TPointerEvent>) {
    const { x, y } = canvas.value!.getViewportPoint(options.e)

    const circle = createCircle(x, y)

    canvas.value?.add(circle)

    if (points.length) {
      const lastPoint = points[points.length - 1]

      if (currentPoint.circle)
        currentPoint.circle.fill = '#60a5fa'

      const line = createLine(lastPoint.x, lastPoint.y, x, y)

      if (currentPoint.line)
        currentPoint.line.stroke = '#9ca3af'

      currentPoint.line = line

      canvas.value?.add(line)

      canvas.value?.sendObjectToBack(line)
    }

    currentPoint.circle = circle

    points.push({
      x,
      y,
    })
  }

  function createCircle(x: number, y: number) {
    const circle = new Circle({
      left: x - radius,
      top: y - radius,
      fill: '#1d4ed8',
      radius,
      selectable: false,
      evented: false,
      objectCaching: false,
    })

    return circle
  }

  function createLine(x1: number, y1: number, x2: number, y2: number) {
    const line = new Line([x1, y1, x2, y2], {
      selectable: false,
      evented: false,
      strokeWidth: 2,
      stroke: '#60a5fa',
      strokeDashArray: [5, 5],
      objectCaching: false,
    })

    return line
  }

  function openDraw() {
    canvas.value?.on('mouse:down', createPoint)
    canvas.value && (canvas.value.defaultCursor = 'default')
  }

  function closeDraw() {
    canvas.value?.off('mouse:down', createPoint)
  }

  function openAction() {
    if (!canvas.value)
      return

    canvas.value.defaultCursor = 'move'

    canvas.value.on('mouse:down', handleMouseDown)
  }

  function closeAction() {
    if (!canvas.value)
      return

    canvas.value.defaultCursor = 'default'

    canvas.value.off('mouse:down', handleMouseDown)
    canvas.value.off('mouse:move', handleMouseMove)
    canvas.value.off('mouse:up', handleMouseUp)
  }

  function handleMouseWheel(options: any) {
    const delta = options.e.deltaY

    // const point = new Point({
    //   x: options.e.offsetX,
    //   y: options.e.offsetY,
    // })

    delta < 0 ? zoomIn() : zoomOut()
  }

  function openMouseWheel() {
    canvas.value?.on('mouse:wheel', handleMouseWheel)
  }

  function closeMouseWheel() {
    canvas.value?.off('mouse:wheel', handleMouseWheel)
  }

  function zoomIn(point?: Point) {
    const center = canvas.value!.getCenterPoint()

    zoom.value = Math.floor(zoom.value * 100 + 50) / 100

    if (zoom.value > 5)
      zoom.value = 5

    canvas.value?.zoomToPoint(point || center, zoom.value)
  }

  function zoomOut(point?: Point) {
    const center = canvas.value!.getCenterPoint()

    zoom.value = Math.floor(zoom.value * 100 - 50) / 100

    if (zoom.value < 0.5)
      zoom.value = 0.5

    canvas.value?.zoomToPoint(point || center, zoom.value)
  }

  function handleMouseDown(option: any) {
    dragMove.lastPosX = option.e.clientX
    dragMove.lastPosY = option.e.clientY
    dragMove.isDrag = true

    canvas.value?.on('mouse:move', handleMouseMove)
    canvas.value?.on('mouse:up', handleMouseUp)
  }

  function handleMouseMove(option: any) {
    if (dragMove.isDrag) {
      const vpt = canvas.value!.viewportTransform
      vpt[4] += option.e.clientX - dragMove.lastPosX
      vpt[5] += option.e.clientY - dragMove.lastPosY
      dragMove.lastPosX = option.e.clientX
      dragMove.lastPosY = option.e.clientY
      canvas.value?.requestRenderAll()
    }
  }

  function handleMouseUp() {
    canvas.value?.setViewportTransform(canvas.value!.viewportTransform)
    dragMove.isDrag = false

    canvas.value?.off('mouse:move', handleMouseMove)
    canvas.value?.off('mouse:up', handleMouseUp)
  }

  // const polygon = new Polygon([
  //   { x: 0, y: 0 },
  //   { x: 0, y: 200 },
  //   { x: 800, y: 0 },
  // ], {
  //   fill: '#eee',
  //   stroke: 'black',
  //   strokeWidth: 2,
  //   objectCaching: false,
  //   selectable: false,
  //   evented: false,
  // })

  return {
    canvas,
    points,
    zoom,
    clear,
    openDraw,
    closeDraw,
    openAction,
    closeAction,
    openMouseWheel,
    closeMouseWheel,
    zoomIn,
    zoomOut,
  }
}
