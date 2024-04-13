import React, { ReactNode } from 'react';
import { OnScrollParams } from 'react-virtualized';
import { ITimelineEngine } from '..';
import { Emitter } from '@/engine/emitter';
import { EventTypes } from '@/engine/events';
import { TimelineAction, TimelineRow } from './action';
export * from './action';
export * from './effect';

export interface EditData {
  /**
   * @description 时间轴编辑数据
   */
  editorData: TimelineRow[];

  scaleCount: number;

  maxCursorTime: number;
  /**
   * @description 单个刻度标记范畴（>0）
   * @default 1
   */
  scale?: number;
  /**
   * @description 单个刻度细分单元数（>0整数）
   * @default 10
   */
  scaleSplitCount?: number;
  /**
   * @description 单个刻度的显示宽度（>0, 单位：px）
   * @default 160
   */
  scaleWidth?: number;
  /**
   * @description 刻度开始距离左侧的距离（>=0, 单位：px）
   * @default 20
   */
  startLeft?: number;
  /**
   * @description 每个编辑行默认高度（>0, 单位：px）
   * @default 32
   */
  rowHeight?: number;
  /**
   * @description 是否启动网格移动吸附
   * @default false
   */
  gridSnap?: boolean;
  /**
   * @description 是否隐藏光标
   * @default false
   */
  hideCursor?: boolean;
  /**
   * @description 禁止全部动作区域拖动
   * @default false
   */
  disableDrag?: boolean;
  /**
   * @description timeline运行器，不传则使用内置运行器
   */
  engine?: ITimelineEngine;
  /**
   * @description 自定义action区域渲染
   */
  getActionRender?: (action: TimelineAction, row: TimelineRow, editActionParams?: {height: number, width: number, left: number, className: string}) => ReactNode;
  /**
   * @description 自定义scale渲染
   */
  getScaleRender?: (scale: number) => ReactNode;
  /**
   * @description cursor开始拖拽事件
   */
  onCursorDragStart?: (time: number) => void;
  /**
   * @description cursor结束拖拽事件
   */
  onCursorDragEnd?: (time: number) => void;
  /**
   * @description cursor拖拽事件
   */
  onCursorDrag?: (time: number) => void;
  /**
   * @description 点击时间区域事件, 返回false时阻止设置时间
   */
  onClickTimeArea?: (time: number, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => boolean | undefined;
}

export interface TimelineState {
  /** dom节点 */
  target: HTMLElement;
  /** 运行监听器 */
  listener: Emitter<EventTypes>;
  /** 设置当前播放时间 */
  setTime: (time: number) => void;
  /** 设置scroll left */
  setScrollLeft: (val: number) => void;
  /** 设置scroll top */
  setScrollTop: (val: number) => void;
}

/**
 * 动画编辑器参数
 * @export
 * @interface TimelineProp
 */
export interface TimelineEditor extends EditData {
  /**
   * @description 编辑区域距离顶部滚动距离 (请使用ref.setScrollTop代替)
   * @deprecated
   */
  scrollTop?: number;
  /**
   * @description 编辑区域滚动回调 (用于控制与编辑行滚动同步)
   */
  onScroll?: (params: OnScrollParams) => void;
  /**
   * @description 拖拽时是否启动自动滚动
   * @default false
   */
  autoScroll?: boolean;
  /**
   * @description 自定义timeline样式
   */
  style?: React.CSSProperties;
  /**
   * @description 数据改变回调，会在操作动作end改变数据后触发(返回false会阻止自动engine同步，用于减少性能开销)
   */
  onChange?: (editorData: TimelineRow[]) => void | boolean;
}
