import { parserPixelToTime, parserTimeToPixel } from '@/utils/deal_data';
import React, { FC, useEffect, useRef } from 'react';
import { AutoSizer, Grid, GridCellRenderer, OnScrollParams } from 'react-virtualized';
import { CommonProp } from '@/interface/common_prop';
import { prefix } from '@/utils/deal_class_prefix';
import './time_area.less';

/** 动画时间轴组件参数 */
export type TimeAreaProps = CommonProp & {
  /** 左侧滚动距离 */
  scrollLeft: number;
  /** 滚动回调，用于同步滚动 */
  onScroll: (params: OnScrollParams) => void;
  /** 设置光标位置 */
  setCursor: (param: { left?: number; time?: number }) => void;
};

/** 动画时间轴组件 */
export const TimeArea: FC<TimeAreaProps> = ({ setCursor, hideCursor, scale, scaleWidth, scaleCount, scaleSplitCount, startLeft, scrollLeft, onClickTimeArea, getScaleRender, maxCursorTime }) => {
  const gridRef = useRef<Grid>();
  /** 是否显示细分刻度 */
  const showUnit = scaleSplitCount > 0;

  /** 获取每个cell渲染内容 */
  const cellRenderer: GridCellRenderer = ({ columnIndex, key, style }) => {
    const isShowScale = showUnit ? columnIndex % scaleSplitCount === 0 : true;
    const classNames = ['time-unit'];
    if (isShowScale) classNames.push('time-unit-big');
    const item = (showUnit ? columnIndex / scaleSplitCount : columnIndex) * scale;

    console.log('Test: item > maxCursorTime: ', item > maxCursorTime);
    if (item > maxCursorTime) {
      classNames.push('after-max-cursor-time');
    }

    const unitScaleClassNames = ['time-unit-scale'];
    const unitStyle: any = {};
    if (item > maxCursorTime) {
      unitScaleClassNames.push('after-max-cursor-time-unit');
      unitStyle.width = Math.min(parserTimeToPixel(item-maxCursorTime, {startLeft: 0, scaleWidth, scale}), scaleWidth);
      console.log('Test: unitStyle.width: ', unitStyle.width);
    }

    return (
      <div key={key} style={style} className={prefix(...classNames)}>
        {isShowScale && <div className={prefix(...unitScaleClassNames)} style={unitStyle}>{getScaleRender ? getScaleRender(item) : item}</div>}
      </div>
    );
  };

  useEffect(() => {
    gridRef.current?.recomputeGridSize();
  }, [scaleWidth, startLeft]);

  /** 获取列宽 */
  const getColumnWidth = (data: { index: number }) => {
    switch (data.index) {
      case 0:
        return startLeft;
      default:
        return showUnit ? scaleWidth / scaleSplitCount : scaleWidth;
    }
  };

  return (
    <div className={prefix('time-area')}>
      <AutoSizer>
        {({ width, height }) => {
          return (
            <>
              <Grid
                ref={gridRef}
                columnCount={showUnit ? scaleCount * scaleSplitCount + 1 : scaleCount}
                columnWidth={getColumnWidth}
                rowCount={1}
                rowHeight={height}
                width={width}
                height={height}
                overscanRowCount={0}
                overscanColumnCount={10}
                cellRenderer={cellRenderer}
                scrollLeft={scrollLeft}
              ></Grid>
              <div
                style={{ width, height }}
                onClick={(e) => {
                  if (hideCursor) return;
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  const position = e.clientX - rect.x;
                  const left = Math.max(position + scrollLeft, startLeft);
                  if (left > scaleCount * scaleWidth + startLeft) return;

                  const time = parserPixelToTime(left, { startLeft, scale, scaleWidth });
                  const result = onClickTimeArea && onClickTimeArea(time, e);
                  if (result === false) return; // 返回false时阻止设置时间
                  setCursor({ time });
                }}
                className={prefix('time-area-interact')}
              ></div>
            </>
          );
        }}
      </AutoSizer>
    </div>
  );
};
