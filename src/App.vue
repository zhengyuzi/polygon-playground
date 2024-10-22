<script setup lang="ts">
import type { TPointerEvent, TPointerEventInfo } from 'fabric'
import { Canvas, Circle, Line } from 'fabric'

interface IPoint {
  circle: Circle<any>
  x: number
  y: number
}

const canvasEl = ref<HTMLCanvasElement>()

let canvas: Canvas

const points = reactive<IPoint[]>([])

onMounted(() => {
  canvas = new Canvas(canvasEl.value, {
    backgroundColor: '#ffffff',
  })

  canvas.setDimensions({
    width: 800,
    height: 500,
  })

  canvas.on('mouse:down', createPoint)
})

function createPoint(options: TPointerEventInfo<TPointerEvent>) {
  const { x, y } = canvas.getViewportPoint(options.e)

  const circle = new Circle({
    left: x - 2,
    top: y - 2,
    fill: 'blue',
    radius: 4,
    selectable: false,
    evented: false,
    objectCaching: false,
  })

  canvas.add(circle)

  if (points.length) {
    const lastPoint = points[points.length - 1]
    const line = new Line([lastPoint.x + 2, lastPoint.y + 2, x + 2, y + 2], {
      selectable: false,
      evented: false,
      strokeWidth: 2,
      stroke: '#000000',
      strokeDashArray: [5, 5],
      objectCaching: false,
    })

    canvas.add(line)
  }

  points.push({
    circle,
    x,
    y,
  })
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

// canvas.add(polygon)
</script>

<template>
  <div class="w-screen h-screen overflow-hidden bg-gray-100">
    <div>
      <canvas ref="canvasEl" />
    </div>
  </div>
</template>
