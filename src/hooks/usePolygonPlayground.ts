import { unrefElement, useResizeObserver } from '@vueuse/core'
import { PPCanvas } from '../core'

export interface UseCanvasOptions {
  width?: number
  height?: number
  radius?: number
}

export default function usePolygonPlayground(
  target: MaybeRefOrGetter<HTMLCanvasElement | null | undefined>,
  options: UseCanvasOptions = {},
) {
  const {
    radius = 5,
  } = options

  const canvas = ref<PPCanvas>()

  onMounted(() => {
    const element = unrefElement(target)!

    canvas.value = new PPCanvas(element, {
      selection: false,
    })

    useResizeObserver(canvas.value.wrapperEl.parentElement, (entries) => {
      const entry = entries[0]
      const { width, height } = entry.contentRect
      canvas.value?.setDimensions({ width, height })
    })
  })

  return {
    canvas,
  }
}
