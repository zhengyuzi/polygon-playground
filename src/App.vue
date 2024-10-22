<script setup lang="ts">
import useCanvas from './hooks/useCanvas'

const canvasEl = ref<HTMLCanvasElement>()

useCanvas(canvasEl)

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
