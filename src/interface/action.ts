/**
 * 动作的基本参数
 * @export
 * @interface TimelineAction
 */
export interface TimelineAction {
  /** 动作id */
  id: string;
  /** 动作开始时间 */
  start: number;
  /** 动作结束时间 */
  end: number;

  /** 动作是否被选中 */
  selected?: boolean;
  /** 动作是否禁止运行 */
  disable?: boolean;
}

/**
 * 动作行基本参数
 * @export
 * @interface TimelineRow
 */
export interface TimelineRow {
  /** 动作行id */
  id: string;
  /** 行的动作列表 */
  actions: TimelineAction[];
  /** 自定义行高 */
  rowHeight?: number;
  /** 行是否选中 */
  selected?: boolean;
  /** 行的扩展类名 */
  classNames?: string[];
}
