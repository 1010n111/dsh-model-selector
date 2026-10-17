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
import * as react from 'react';
/**
 * 在 `ref` 指向的 canvas 上绘制最高档粒子。
 * @param ref - 填充区内的 canvas；未挂载或 inactive 时不启动循环。
 * @param active - 是否处于最高档。
 */
export declare function useMaxParticles(ref: react.RefObject<HTMLCanvasElement | null>, active: boolean): void;
//# sourceMappingURL=effortParticles.d.ts.map