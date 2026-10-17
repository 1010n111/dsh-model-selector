/**
 * dsh-model-selector — 最高档（Ultra/Max）的稀疏粒子层。
 *
 * Codex 的思考等级条只有最后一档带动态效果：蓝紫渐变填充上漂着细小的白色粒子，
 * 其余档位完全静止。本模块只负责这一件事——用 canvas 在填充区内画十几颗缓慢
 * 漂移、轻微闪烁的 1px 白点；不发光、不拖尾、不叠加模糊，避免回到「AI 光效」。
 *
 * 约束：
 *  - 仅当 `active`（最高档）时启动 rAF，离开立即取消；菜单关闭随组件卸载停止。
 *  - 尊重 `prefers-reduced-motion`：只画一帧静态星点，不循环。
 *  - 主题无关：粒子是白色半透明，深浅色底都成立。
 */
import * as react from 'react'

/** 每帧最多 18 颗，够铺满 ~200px 的填充区又不至于变成星空。 */
const COUNT = 18

/** mulberry32：确定性伪随机，避免每次打开菜单粒子分布完全一样又不用 Math.random。 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * 在 `ref` 指向的 canvas 上绘制最高档粒子。
 * @param ref - 填充区内的 canvas；未挂载或 inactive 时不启动循环。
 * @param active - 是否处于最高档。
 */
export function useMaxParticles(
  ref: react.RefObject<HTMLCanvasElement | null>,
  active: boolean,
): void {
  react.useEffect(() => {
    if (!active) return
    const canvas = ref.current
    if (canvas === null) return
    const context = canvas.getContext('2d')
    if (context === null) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let width = 1
    let height = 1

    const fit = (): void => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    fit()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(fit)
    observer?.observe(canvas)

    const random = mulberry32(0x9e3779b9)
    const particles = Array.from({ length: COUNT }, () => ({
      x: random() * width,
      y: 3 + random() * Math.max(1, height - 6),
      radius: 0.6 + random() * 0.9,
      vx: 2 + random() * 7,
      vy: -0.8 + random() * 1.6,
      phase: random() * Math.PI * 2,
      twinkle: 0.5 + random() * 0.9,
    }))

    const draw = (time: number): void => {
      context.clearRect(0, 0, width, height)
      for (const particle of particles) {
        if (!reduced) {
          particle.x += particle.vx / 60
          particle.y += particle.vy / 60
          if (particle.x > width + 2) {
            particle.x = -2
            particle.y = 3 + random() * Math.max(1, height - 6)
          }
          if (particle.y < -2) particle.y = height + 2
          if (particle.y > height + 2) particle.y = -2
        }
        const wave = Math.sin(time * 0.001 * particle.twinkle + particle.phase)
        const alpha = reduced ? 0.55 : 0.3 + 0.5 * wave * wave
        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`
        context.fill()
      }
      if (!reduced) frame = requestAnimationFrame(draw)
    }

    if (reduced) draw(0)
    else frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      context.clearRect(0, 0, width, height)
    }
  }, [active, ref])
}
