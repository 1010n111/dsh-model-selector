/**
 * dsh-model-selector — 菜单弹出方向与高度钳位的纯函数。
 *
 * 从 ModelSelect.tsx 原样搬出（无 JSX、无 DOM、无模块级副作用），以便用
 * node --test 直接跑源码：方向决策（向上 vs 向下弹）与两侧的高度钳位都是
 * 用户可见且曾在矮窗口/滚动场景出过 bug 的逻辑，留在 .tsx 里则无法脱离
 * 浏览器测试。
 *
 * 横向摆位已交给官方 `useAnchoredPosition`（0.2.1 起支持 `align: 'end'`），
 * 这里只保留「选边」与「该边可用高度」两件事。
 */

/** 菜单设计最大高度（px）；实际按 trigger 上方/下方可用空间钳位。
 * 调法：调大允许更高菜单（矮视口下仍会被钳到视口内），调小菜单更矮。 */
export const MENU_MAX_HEIGHT = 420;
/** 与视口边缘保留的距离（px）；对齐 primitives 里未导出的 MARGIN。
 *
 * 调用 `useAnchoredPosition` 时**显式传这个值**作为 margin 参数（见
 * ModelSelect.tsx 的调用点），而不是靠官方默认值恰好也是 12 的巧合：上游一旦把
 * 默认 MARGIN 改掉，隐式依赖会让本菜单的贴边距离跟着漂，而菜单自身毫无察觉。
 * `test/official-seat-shadow.test.mjs` 反向钉住「调用点显式传它」与官方 hook 的
 * align/side/ResizeObserver 前提——官方收了能力会红，届时再决定跟随还是分叉。
 * 改动同时影响向上/向下弹与官方 hook 的钳位边距，需与官方 MARGIN 意图保持一致。 */
export const MENU_VIEWPORT_MARGIN = 12;

/**
 * 向上弹当且仅当 trigger 上方可用空间不小于下方可用空间：
 * 取上下两侧中空间更大的一侧，避免矮窗口把面板挤到视口下沿外面。
 */
export function dmsMenuAbove(triggerTop: number, triggerBottom: number, viewportHeight: number): boolean {
  return triggerTop >= viewportHeight - triggerBottom;
}

/** 向上弹时按 trigger 上方空间钳位菜单高度（bottom-anchored，不能复用向下弹的公式）。 */
export function dmsAboveMaxHeight(triggerTop: number, cap: number): number {
  return Math.max(0, Math.min(cap, triggerTop - MENU_VIEWPORT_MARGIN));
}

/** 向下弹时按 trigger 下方空间钳位菜单高度（top-anchored，不能复用向上弹的公式）。 */
export function dmsBelowMaxHeight(triggerBottom: number, viewportHeight: number, cap: number): number {
  return Math.max(0, Math.min(cap, viewportHeight - triggerBottom - MENU_VIEWPORT_MARGIN));
}
