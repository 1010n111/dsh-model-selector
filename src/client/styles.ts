/**
* Stylesheet for the enhanced model seat.
*
* Injected as one `<style data-plugin="@bittersmilezzz/dsh-model-selector">` tag by the client
* apply and removed again on unload. Class names are prefixed `dms-` so they
* cannot collide with CSS-module hashes from other plugins. Colors come only
* from `--dsw-*` theme tokens, matching the shipped Menu material.
*
* 显式 `: string` 注解：不加注解时 tsc 会把整份 CSS 推断成字面量类型并写进
* lib/types/client/styles.d.ts（19KB 的 d.ts 只为声明一个常量），发布包里
* 白白多出十几 KB 且每次改样式都全量重写。
*/
export const CSS: string = `
.dms-root {
  position: relative;
  min-width: 0;
}
/* root 只作为焦点落点（tabIndex=-1）：不画焦点环，真正的可聚焦控件在它内部。 */
.dms-root:focus { outline: none; }

.dms-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  max-width: min(420px, calc(100vw - 48px));
  height: 28px;
  padding: 0 4px 0 8px;
  border: none;
  border-radius: 24px;
  outline: none;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  cursor: pointer;
}
.dms-trigger:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.dms-trigger:focus-visible { box-shadow: 0 0 0 2px var(--dsw-alias-border-l3); }
.dms-trigger:disabled { color: var(--dsw-alias-label-dimmed); cursor: default; }

.dms-triggerLabel {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 20px;
}
.dms-triggerEffort {
  flex: 0 0 auto;
  line-height: 20px;
  color: var(--dsw-alias-label-caption);
}
.dms-triggerProvider {
  flex: 0 0 auto;
  max-width: 88px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--dsw-alias-label-caption);
  font-size: 11px;
  line-height: 20px;
  font-weight: 400;
}

.dms-chevron,
.dms-groupChevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  line-height: 0;
}
.dms-chevron {
  color: var(--dsw-alias-label-caption);
  transition: transform 120ms ease;
}
.dms-chevronOpen { transform: rotate(180deg); }
.dms-groupChevron {
  color: var(--dsw-alias-label-tertiary);
  transition: transform 120ms ease;
}
.dms-groupChevronClosed { transform: rotate(-90deg); }
.dms-model-check svg { display: block; }

.dms-menu {
  /* 官方 useAnchoredPosition 返回视口坐标：fixed 定位让它不再依赖 .dms-root
     的 padding box，免去 root 左缘减法那一层坐标系转换。 */
  position: fixed;
  z-index: 20;
  display: flex;
  flex-direction: column;
  width: min(280px, calc(100vw - 32px));
  overflow: hidden;
  padding: 4px 0 4px 4px;
  box-sizing: border-box;
  border: 1px solid var(--dsw-alias-border-inverted);
  border-radius: 12px;
  background: var(--dsw-specific-menu);
  box-shadow: var(--dsw-shadow-lv3);
  color: var(--dsw-alias-label-primary);
  animation: dms-menu-in 150ms cubic-bezier(.22,1,.36,1);
  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);
  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);
}
.dms-menuModel { border-right: none; }
.dms-menuBelow {
  animation-name: dms-menu-in-below;
}

/* 菜单头部的「非列表」栏（loading / 空态 / 错误条 / 失败条 / 截断提示）：
   一律允许收缩（flex-shrink 1）且各自限高，让 .dms-groups 始终保住可滚动
   的最小可视高度。2026-09-21 修复的 P0：向上弹时 useAnchoredMaxHeight 会把
   maxHeight 钳到「trigger 底缘 - 12px」（底缘固定、向上生长的语义），trigger
   靠近视口顶部时该值很小；原先这些栏是 flex: 0 0 auto 完全不收缩，头部
   40-100px 全部占完后 .dms-groups 的可视高度趋近 0，而 .dms-menu 是
   overflow:hidden —— 用户看到错误条却看不到也滚不到任何模型行。
   现在给它们统一的上限（相对菜单高度）+ overflow，最坏情况是栏内自己滚动。 */
.dms-status,
.dms-empty {
  flex: 0 1 auto;
  min-height: 0;
  max-height: 40%;
  overflow-y: auto;
  padding: 10px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 13px;
  line-height: 20px;
}

.dms-more {
  flex: 0 1 auto;
  min-height: 0;
  max-height: 20%;
  overflow-y: auto;
  padding: 8px 12px;
  border-top: 1px solid var(--dsw-alias-border-l1, transparent);
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
}

/* Provider-load failure strip: capped and scrollable so a long list of failed
   groups can never squeeze the model list out of the menu (E4). */
.dms-failures {
  flex: 0 1 auto;
  max-height: min(96px, 30%);
  min-height: 0;
  overflow-y: auto;
}

.dms-error,
.dms-warning {
  flex: 0 1 auto;
  min-height: 0;
  max-height: 40%;
  overflow-y: auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
  padding: 7px 8px;
  border-radius: 8px;
  background: var(--dsw-alias-interactive-bg-hover-danger);
  color: var(--dsw-alias-state-error-primary);
  font-size: 12px;
  line-height: 18px;
}
.dms-warning {
  background: var(--dsw-alias-bg-module-platform);
  color: var(--dsw-alias-state-warn-label);
}
.dms-retry {
  flex: 0 0 auto;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
.dms-retry:focus-visible { box-shadow: 0 0 0 2px var(--dsw-alias-border-l3); }

/* Search box pinned above the scrollable list. */
.dms-search {
  position: relative;
  margin-bottom: 4px;
  margin-right: 4px;
  flex: 0 0 auto;
}
.dms-searchInput {
  box-sizing: border-box;
  width: 100%;
  height: 30px;
  padding: 0 30px 0 10px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  outline: none;
  background: var(--dsw-alias-bg-input);
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  line-height: 18px;
}
.dms-searchInput::placeholder { color: var(--dsw-alias-label-tertiary); }
.dms-searchInput:focus-visible { box-shadow: 0 0 0 2px var(--dsw-alias-border-l3); }
.dms-searchClear {
  position: absolute;
  top: 0;
  right: 0;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
}
.dms-searchClear:hover { color: var(--dsw-alias-label-primary); }
/* 键盘焦点此前在这三个可聚焦控件上完全隐身（上轮只补了模型行）。 */
.dms-searchClear:focus-visible {
  border-radius: 8px;
  box-shadow: 0 0 0 2px var(--dsw-alias-border-l3);
}
/* 图标组件只收 size/className，装饰性 aria-hidden 只能包一层 span；contents 让它不占布局。 */
.dms-icon-slot { display: contents; }

/* 列表区：菜单里唯一的弹性主体。max-height 被 useAnchoredMaxHeight 钳得很小
   （trigger 靠近视口顶 + 向上弹）时，32px 保底让「至少见到一行模型」始终成立
   —— 头部各栏此时按自己的 max-height 百分比上限收缩（见 .dms-status 等）。 */
.dms-groups { flex: 1 1 auto; min-height: 32px; overflow-y: auto; contain: content; }
/* 空态占位：空态播报节点在 role=menu 容器外，用与 .dms-groups 同款弹性布局
   补回列表区本来的位置（不挤压其余栏，消息也不会贴到菜单顶部）。 */
.dms-groupsFill { flex: 1 1 auto; min-height: 0; overflow-y: auto; contain: content; }
.dms-group + .dms-group { margin-top: 4px; }

/* Collapsible provider header: a full-width toggle button. */
.dms-groupHeader {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 5px 8px 3px;
  border: none;
  outline: none;
  background: var(--dsw-specific-menu);
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
}
.dms-groupHeader:hover { color: var(--dsw-alias-label-primary); }
.dms-groupHeader:focus-visible { box-shadow: inset 0 0 0 2px var(--dsw-alias-border-l3); }
.dms-groupName {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dms-groupCount { flex: 0 0 auto; color: var(--dsw-alias-label-dimmed); font-weight: 400; }

.dms-nameRow {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.dms-badge {
  flex: 0 0 auto;
  padding: 0 6px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  color: var(--dsw-alias-label-caption);
  font-size: 10px;
  line-height: 16px;
  font-weight: 500;
}
.dms-notice {
  flex: 0 0 auto;
  margin: 4px 0 0;
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
}
/* 常驻 live region（内容随状态更新）：空时收起，不占位。 */
.dms-notice:empty { display: none; }
.dms-effort {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
  min-width: 0;
  /* 固定行高：档位名/说明文字长短不参与布局，菜单高度与滑杆位置不会跳动。 */
  height: 32px;
  color: var(--dsw-alias-label-secondary);
  user-select: none;
  box-sizing: border-box;
}
/* 档位读数：拖动时实时跟随 preview，替代此前只有读屏能看到的 aria-valuetext。 */
.dms-effort-value {
  flex: 0 0 auto;
  margin-left: 8px;
  width: 3.6em;
  color: var(--dsw-static-blue-500, #3b82f6);
  font-size: 11px;
  line-height: 16px;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dms-effort.is-max .dms-effort-value { color: #8b5cf6; }
.dms-effort-slider {
  /* 由组件写入：滑块中心位置（相对轨道），两端各留 12px（滑块半径）。 */
  --dms-thumb-left: 12px;
  position: relative;
  width: 100%;
  height: 30px;
  /* 不能用 flex-basis: 0：轨道主轴（横向）是宽度时它会被读成「主尺寸 0」，
     滑块宽度不生长，刚打开/重渲染后回跳到轨道起点。 */
  flex: 1 1 auto;
  min-width: 0;
  isolation: isolate;
  /* 常驻合成层：拖动/提交时只有本层重绘，不会波及整个 fixed 菜单
     （实机表现为松手瞬间菜单闪白）。 */
  transform: translateZ(0);
  backface-visibility: hidden;
}
/* Codex 式轨道：一条中性灰胶囊，档位点直接落在轨道上。 */
.dms-effort-track {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 20px;
  transform: translateY(-50%);
  border-radius: 999px;
  background: rgba(255, 255, 255, .10);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.05), inset 0 -1px 0 rgba(0,0,0,.30);
  overflow: hidden;
}
.dms-effort-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--dms-thumb-left);
  border-radius: 999px;
  background: var(--dsw-static-blue-500, #3b82f6);
  /* 不做 background 过渡：跳进/跳出最高档时只换渐变色，避免中间帧把渐变
     与底下轨道混成一片发灰/发白。 */
  transition: width 200ms cubic-bezier(.22,1,.36,1);
  overflow: hidden;
}
/* 只有最高档（Ultra/Max）换成蓝紫渐变 + 粒子；其余档位保持实心蓝、完全静止。 */
.dms-effort.is-max .dms-effort-fill {
  background: linear-gradient(90deg, var(--dsw-static-blue-500, #3b82f6) 0%, #6d5cff 55%, #a855f7 100%);
}
.dms-effort-particles {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.dms-effort-dot {
  position: absolute;
  top: 50%;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, .26);
  transition: background 160ms ease;
}
.dms-effort-dot.is-on { background: rgba(255, 255, 255, .62); }
.dms-effort-knob {
  position: absolute;
  z-index: 4;
  top: 50%;
  left: var(--dms-thumb-left);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,.35), 0 0 0 .5px rgba(0,0,0,.08);
  transform: translate(-50%, -50%);
  transition: left 200ms cubic-bezier(.22,1,.36,1), transform 120ms ease;
  pointer-events: none;
}
.dms-effort-input {
  /* 自定义 slider 的命中层：透明 div，不参与绘制（原生 range 的白色焦点环问题
     见 ModelSelect.tsx 的说明）。 */
  position: absolute;
  z-index: 5;
  inset: -5px 0;
  width: 100%;
  height: calc(100% + 10px);
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  outline: none;
  cursor: grab;
  touch-action: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.dms-effort-input:active { cursor: grabbing; }
.dms-effort-input:focus-visible + .dms-effort-knob {
  outline: 2px solid var(--dsw-static-blue-400);
  outline-offset: 2px;
}
/* 拖动时滑块跟手，不保留上一段过渡；松手磁吸由 React 的 preview 回写照常。 */
.dms-effort.is-dragging .dms-effort-fill,
.dms-effort.is-dragging .dms-effort-knob { transition: none; }
.dms-effort.is-dragging .dms-effort-knob { transform: translate(-50%, -50%) scale(1.06); }
.dms-effort.is-error .dms-effort-slider {
  outline: 1px solid var(--dsw-alias-state-error-secondary);
  outline-offset: 2px;
}
.dms-effort-error { flex: 1 0 100%; margin-top: 8px; padding: 6px 10px; border-radius: 8px; color: var(--dsw-alias-state-error-primary, #c83e4d); background: var(--dsw-alias-state-error-tertiary, rgba(220,55,70,.08)); font-size: 11px; line-height: 1.5; }
/* 常驻容器（内容随状态更新）：空时收起，不占位。 */
.dms-effort-error:empty { display: none; }
/* 视觉隐藏工具类（SR 播报/错误原文：不占布局但可被读屏读到）。 */
.dms-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.dms-model-option {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 20px;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 38px;
  padding: 7px 9px;
  border: 0;
  border-radius: 9px;
  color: inherit;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.dms-model-option:hover { background: var(--dsw-alias-fill-tertiary, rgba(120,125,140,.09)); }
.dms-model-option-copy { min-width: 0; }
.dms-model-option-name { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
/* 搜索命中片段：名称内标下划线（命中描述/供应商时不标，见 nameHit）。 */
.dms-hit {
  text-decoration: underline;
  text-decoration-color: var(--dsw-static-blue-400, #4d70ff);
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}
.dms-model-option-desc { display: block; margin-top: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-tertiary, #9296a0); font-size: 10px; }
.dms-model-check { color: var(--dsw-static-deepseek-500, #4d70ff); font-size: 15px; text-align: center; }
/* 方向键导航把焦点落在选项上。选中态是「背景 + 加粗 + 勾号」，悬停是「背景」，
   两者与焦点指示必须两两可辨 —— 只用同一个 hover 背景 token 会让「焦点落在
   选中行上」完全不可见（roving 的默认落点恰恰优先选中行）。 */
.dms-model-option:focus-visible {
  background: var(--dsw-alias-interactive-bg-hover);
  box-shadow: inset 0 0 0 2px var(--dsw-alias-border-l3);
}
/* 当前选中行：仅靠勾号不足以在密集列表里定位。 */
.dms-model-optionSelected { background: var(--dsw-alias-interactive-bg-hover); }
.dms-model-optionSelected .dms-model-option-name { font-weight: 600; }
/* select 进行中：官方以 disabled 变灰表达，这里用 aria-busy 驱动同样的视觉、
   不夺键盘焦点（aria-disabled 保连续性，见 ModelOption）。aria-busy 挂在
   role=menu/listbox 容器上（.dms-groups）—— 挂在外层 .dms-menu 会罩住
   live region、压制其播报。 */
.dms-groups[aria-busy="true"] .dms-model-option { color: var(--dsw-alias-label-dimmed); }
/* 搜索结果里的供应商标是区分跨供应商同名模型的唯一线索，之前无任何样式。 */
.dms-model-option-provider {
  display: block;
  margin-top: 2px;
  overflow: hidden;
  color: var(--dsw-alias-label-dimmed, #9296a0);
  font-size: 10px;
  line-height: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@keyframes dms-menu-in {
  from { opacity: 0; transform: translateY(5px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes dms-menu-in-below {
  from { opacity: 0; transform: translateY(-5px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
body:not([data-ds-dark-theme]) .dms-effort-track {
  background: #e9e9e9;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.65);
}
body:not([data-ds-dark-theme]) .dms-effort-dot { background: rgba(0,0,0,.18); }
body:not([data-ds-dark-theme]) .dms-effort-dot.is-on { background: rgba(255,255,255,.78); }
body:not([data-ds-dark-theme]) .dms-effort-knob {
  box-shadow: 0 1px 3px rgba(0,0,0,.22), 0 0 0 .5px rgba(0,0,0,.06);
}
@media (prefers-reduced-motion: reduce) {
  .dms-chevron,
  .dms-groupChevron,
  .dms-effort-fill,
  .dms-effort-dot,
  .dms-effort-knob { transition: none; }
  .dms-menu { animation: none; }
}

/* Inline effort footer pinned below the scrollable model list (single-pane
   menu: switching models and adjusting effort both live in one surface). */
.dms-effortFooter {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 4px 0 0;
  padding: 6px 10px;
  border-top: 1px solid var(--dsw-alias-border-l2);
}
.dms-effortFooterLabel {
  flex: 0 0 auto;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  line-height: 18px;
  white-space: nowrap;
}
.dms-effortFooter .dms-effort { flex: 1 1 auto; min-width: 0; }

`;
