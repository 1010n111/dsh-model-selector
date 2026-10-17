import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  dmsAboveMaxHeight,
  dmsMenuAbove,
  dmsBelowMaxHeight,
  MENU_MAX_HEIGHT,
  MENU_VIEWPORT_MARGIN,
} from '../src/client/menuFit.ts'

test('dmsMenuAbove：上方空间不小于下方空间时向上弹', () => {
  // trigger 中部：上 450 / 下 420 —— 上方大，向上弹
  assert.equal(dmsMenuAbove(450, 480, 900), true)
  // 上 600 / 下 270 —— 明显上方大，向上弹
  assert.equal(dmsMenuAbove(600, 630, 900), true)
})

test('dmsMenuAbove：下方空间更大时向下弹', () => {
  // trigger 贴近顶部：上 100 / 下 772 —— 向下弹
  assert.equal(dmsMenuAbove(100, 128, 900), false)
  // 上 0 / 下 900 —— 顶部贴边，向下弹
  assert.equal(dmsMenuAbove(0, 30, 900), false)
})

test('dmsMenuAbove：窗口变矮时不再要求上方空出满高', () => {
  // 矮窗口 400：trigger 上 201 / 下 229 —— 上方(201) < 下方(171)? 否，
  // 201 >= 400-229=171 成立 → 仍向上（这正是旧 bug 的回归防护：原逻辑
  // rect.top >= 440 在矮窗口永远 false，会把面板挤到下沿外）。
  assert.equal(dmsMenuAbove(201, 229, 400), true)
  // 更极端：上 100 / 下 100，矮窗口也向上（相等取上）
  assert.equal(dmsMenuAbove(100, 128, 228), true)
})

test('dmsAboveMaxHeight：按上方可用空间钳位', () => {
  // 正常情况：上方空间足够时取设计上限
  assert.equal(dmsAboveMaxHeight(900, MENU_MAX_HEIGHT), MENU_MAX_HEIGHT)
  // 上方空间不足：减去视口边距
  assert.equal(dmsAboveMaxHeight(300, MENU_MAX_HEIGHT), 300 - MENU_VIEWPORT_MARGIN)
  // 触发点贴顶：钳到 0（不回负）
  assert.equal(dmsAboveMaxHeight(0, MENU_MAX_HEIGHT), 0)
  assert.equal(dmsAboveMaxHeight(10, MENU_MAX_HEIGHT), 0)
  // cap 更小时取 cap
  assert.equal(dmsAboveMaxHeight(900, 200), 200)
})

test('dmsBelowMaxHeight：按下方可用空间钳位', () => {
  // 正常情况：下方空间足够时取设计上限
  assert.equal(dmsBelowMaxHeight(100, 900, MENU_MAX_HEIGHT), MENU_MAX_HEIGHT)
  // 下方空间不足：减去视口边距
  assert.equal(dmsBelowMaxHeight(600, 900, MENU_MAX_HEIGHT), 900 - 600 - MENU_VIEWPORT_MARGIN)
  // 触发点贴底：钳到 0（不回负）
  assert.equal(dmsBelowMaxHeight(890, 900, MENU_MAX_HEIGHT), 0)
  assert.equal(dmsBelowMaxHeight(950, 900, MENU_MAX_HEIGHT), 0)
  // cap 更小时取 cap
  assert.equal(dmsBelowMaxHeight(100, 900, 200), 200)
})

test('两侧钳位对称：cap 不设限时上下可用高度加双边距等于视口高', () => {
  // 视口 900、trigger 底缘 500、cap 取 1000（不触发设计上限）：上 488 + 下 388 + 双边距 24 = 900。
  const cap = 1000
  const above = dmsAboveMaxHeight(500, cap)
  const below = dmsBelowMaxHeight(500, 900, cap)
  assert.equal(above + below + MENU_VIEWPORT_MARGIN * 2, 900)
})

test('常量对齐设计意图', () => {
  assert.equal(MENU_MAX_HEIGHT, 420)
  assert.equal(MENU_VIEWPORT_MARGIN, 12)
})
