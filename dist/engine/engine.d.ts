import { TimelineAction, TimelineRow } from '../interface/action';
import { TimelineEffect } from '../interface/effect';
import { Emitter } from './emitter';
import { EventTypes } from './events';
type PlayState = 'playing' | 'paused';
export interface ITimelineEngine extends Emitter<EventTypes> {
    readonly isPlaying: boolean;
    readonly isPaused: boolean;
    effects: Record<string, TimelineEffect>;
    data: TimelineRow[];
    /** 设置播放速率 */
    setPlayRate(rate: number): boolean;
    /** 获取播放速率 */
    getPlayRate(): number;
    /** 重新渲染当前时间 */
    reRender(): void;
    /** 设置播放时间 */
    setTime(time: number, isTick?: boolean): boolean;
    /** 获取播放时间 */
    getTime(): number;
    /** 播放 */
    play(param: {
        /** 默认从头运行到尾, 优先级大于autoEnd */
        toTime?: number;
        /** 是否播放完后自动结束 */
        autoEnd?: boolean;
    }): boolean;
    /** 暂停 */
    pause(): void;
}
/**
 * 时间轴播放器
 * 可脱离编辑器单独运行
 * @export
 * @class TimelineEngine
 * @extends {Emitter<EventTypes>}
 */
export declare class TimelineEngine extends Emitter<EventTypes> implements ITimelineEngine {
    constructor();
    /** requestAnimationFrame timerId */
    protected _timerId: number;
    /** 播放速率 */
    protected _playRate: number;
    /** 当前时间 */
    protected _currentTime: number;
    /** 播放状态 */
    protected _playState: PlayState;
    /** 时间帧pre数据 */
    protected _prev: number;
    /** 动作效果map */
    protected _effectMap: Record<string, TimelineEffect>;
    /** 需要运行的动作map */
    protected _actionMap: Record<string, TimelineAction>;
    /** 按动作开始时间正序排列后的动作id数组 */
    protected _actionSortIds: string[];
    /** 当前遍历到的action index */
    protected _next: number;
    /** 动作时间范围包含当前时间的actionId列表 */
    protected _activeActionIds: string[];
    /** 是否正在播放 */
    get isPlaying(): boolean;
    /** 是否暂停中 */
    get isPaused(): boolean;
    set effects(effects: Record<string, TimelineEffect>);
    set data(data: TimelineRow[]);
    /**
     * 设置播放速率
     * @memberof TimelineEngine
     */
    setPlayRate(rate: number): boolean;
    /**
     * 获取播放速率
     * @memberof TimelineEngine
     */
    getPlayRate(): number;
    /**
     * 重新渲染当前时间
     * @return {*}
     * @memberof TimelineEngine
     */
    reRender(): void;
    /**
     * 设置播放时间
     * @param {number} time
     * @param {boolean} [isTick] 是否是tick触发
     * @memberof TimelineEngine
     */
    setTime(time: number, isTick?: boolean): boolean;
    /**
     * 获取当前时间
     * @return {*}  {number}
     * @memberof TimelineEngine
     */
    getTime(): number;
    /**
     * 运行: 开始时间为当前time
     * @param param
     * @return {boolean} {boolean}
     */
    play(param: {
        /** 默认从头运行到尾, 优先级大于autoEnd */
        toTime?: number;
        /** 是否播放完后自动结束 */
        autoEnd?: boolean;
    }): boolean;
    /**
     * 暂停播放
     * @memberof TimelineEngine
     */
    pause(): void;
    /** 播放完成 */
    protected _end(): void;
    protected _startOrStop(type?: 'start' | 'stop'): void;
    /** 每帧执行 */
    protected _tick(data: {
        now: number;
        autoEnd?: boolean;
        to?: number;
    }): void;
    /** tick运行actions */
    protected _tickAction(time: number): void;
    /** 重置active数据 */
    protected _dealClear(): void;
    /** 处理action time enter */
    protected _dealEnter(time: number): void;
    /** 处理action time leave */
    protected _dealLeave(time: number): void;
    /** 处理数据 */
    protected _dealData(data: TimelineRow[]): void;
}
export {};
