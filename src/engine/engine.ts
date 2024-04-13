import { Emitter } from './emitter';
import { Events, EventTypes } from './events';

export interface ITimelineEngine extends Emitter<EventTypes> {
  /** 设置播放时间 */
  setTime(time: number, isTick?: boolean): boolean;
  /** 获取播放时间 */
  getTime(): number;
}

/**
 * 时间轴播放器
 * 可脱离编辑器单独运行
 * @export
 * @class TimelineEngine
 * @extends {Emitter<EventTypes>}
 */
export class TimelineEngine extends Emitter<EventTypes> implements ITimelineEngine {
  constructor() {
    super(new Events());
  }

  private _currentTime: number = 0;

  /**
   * 设置播放时间
   * @param {number} time
   * @param {boolean} [isTick] 是否是tick触发
   * @memberof TimelineEngine
   */
  setTime(time: number, isTick?: boolean): boolean {
    const result = isTick || this.trigger('beforeSetTime', { time, engine: this });
    if (!result) return false;

    this._currentTime = time;

    if (isTick) this.trigger('setTimeByTick', { time, engine: this });
    else this.trigger('afterSetTime', { time, engine: this });
    return true;
  }

  getTime(): number {
    return this._currentTime;
  }
}
