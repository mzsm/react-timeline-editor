import { EditData } from "./timeline";

/** 组件公共参数 */
export interface CommonProp extends EditData {
  /** 刻度个数 */
  scaleCount: number;
  /** 光标时间 */
  cursorTime: number;
  /** 当前时间轴宽度 */
  timelineWidth: number;
}
