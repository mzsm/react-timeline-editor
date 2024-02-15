import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ScrollSync } from 'react-virtualized';
import { ITimelineEngine, TimelineEngine } from '@/engine/engine';
import { PREFIX, START_CURSOR_TIME } from '@/interface/const';
import { TimelineEditor, TimelineState } from '@/interface/timeline';
import { checkProps } from '@/utils/check_props';
import { parserPixelToTime, parserTimeToPixel } from '@/utils/deal_data';
import { Cursor } from './cursor/cursor';
import { EditArea } from './edit_area/edit_area';
import './timeline.less';
import { TimeArea } from './time_area/time_area';

export const Timeline = React.forwardRef<TimelineState, TimelineEditor>((props, ref) => {
  const checkedProps = checkProps(props);
  const { style } = props;
  let {
    editorData,
    scrollTop,
    autoScroll,
    hideCursor,
    disableDrag,
    scale,
    scaleWidth,
    startLeft,
    engine,
    onScroll: onScrollVertical,
    rowHeight,
    getActionRender,
    scaleCount,
  } = checkedProps;

  const engineRef = useRef<ITimelineEngine>(engine || new TimelineEngine());
  const domRef = useRef<HTMLDivElement>();
  const areaRef = useRef<HTMLDivElement>();
  const scrollSync = useRef<ScrollSync>();
  // 光标距离
  const [cursorTime, setCursorTime] = useState(START_CURSOR_TIME);
  // 是否正在运行
  const [isPlaying, setIsPlaying] = useState(false);
  // 当前时间轴宽度
  const [width, setWidth] = useState(Number.MAX_SAFE_INTEGER);

  // deprecated
  useEffect(() => {
    scrollSync.current && scrollSync.current.setState({ scrollTop: scrollTop });
  }, [scrollTop]);

  /** 处理光标 */
  const handleSetCursor = (param: { left?: number; time?: number; updateTime?: boolean }) => {
    let { left, time, updateTime = true } = param;
    if (typeof left === 'undefined' && typeof time === 'undefined') return;

    if (typeof time === 'undefined') {
      if (typeof left === 'undefined') left = parserTimeToPixel(time, { startLeft, scale, scaleWidth });
      time = parserPixelToTime(left, { startLeft, scale, scaleWidth });
    }

    let result = true;
    if (updateTime) {
      result = engineRef.current.setTime(time);
    }
    result && setCursorTime(time);
    return result;
  };

  /** 设置scrollLeft */
  const handleDeltaScrollLeft = (delta: number) => {
    // 当超过最大距离时，禁止自动滚动
    const data = scrollSync.current.state.scrollLeft + delta;
    if (data > scaleCount * (scaleWidth - 1) + startLeft - width) return;
    scrollSync.current && scrollSync.current.setState({ scrollLeft: Math.max(scrollSync.current.state.scrollLeft + delta, 0) });
  };

  // 处理运行器相关数据
  useEffect(() => {
    const handleTime = ({ time }) => {
      handleSetCursor({ time, updateTime: false });
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePaused = () => setIsPlaying(false);
    engineRef.current.on('setTimeByTick', handleTime);
    engineRef.current.on('play', handlePlay);
    engineRef.current.on('paused', handlePaused);
  }, []);

  // ref 数据
  useImperativeHandle(ref, () => ({
    get target() {
      return domRef.current;
    },
    get listener() {
      return engineRef.current;
    },
    setTime: (time: number) => handleSetCursor({ time }),
    getTime: engineRef.current.getTime.bind(engineRef.current),
    setScrollLeft: (val) => {
      scrollSync.current && scrollSync.current.setState({ scrollLeft: Math.max(val, 0) });
    },
    setScrollTop: (val) => {
      scrollSync.current && scrollSync.current.setState({ scrollTop: Math.max(val, 0) });
    },
  }));

  // 监听timeline区域宽度变化
  useEffect(() => {
    if (areaRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (!areaRef.current) return;
        setWidth(areaRef.current.getBoundingClientRect().width);
      });
      resizeObserver.observe(areaRef.current!);
      return () => {
        resizeObserver && resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <div ref={domRef} style={style} className={`${PREFIX} ${disableDrag ? PREFIX + '-disable' : ''}`}>
      <ScrollSync ref={scrollSync}>
        {({ scrollLeft, scrollTop, onScroll }) => (
          <>
            <TimeArea
              {...checkedProps}
              timelineWidth={width}
              disableDrag={disableDrag || isPlaying}
              setCursor={handleSetCursor}
              cursorTime={cursorTime}
              editorData={editorData}
              scaleCount={scaleCount}
              onScroll={onScroll}
              scrollLeft={scrollLeft}
            />
            <EditArea
              getActionRender={getActionRender}
              scaleWidth={scaleWidth}
              scale={scale}
              startLeft={startLeft}
              rowHeight={rowHeight}
              ref={(ref) => ((areaRef.current as any) = ref?.domRef.current)}
              editorData={editorData}
              scaleCount={scaleCount}
              scrollTop={scrollTop}
              scrollLeft={scrollLeft}
              onScroll={(params) => {
                onScroll(params);
                onScrollVertical && onScrollVertical(params);
              }}
            />
            {!hideCursor && (
              <Cursor
                {...checkedProps}
                timelineWidth={width}
                disableDrag={isPlaying}
                scrollLeft={scrollLeft}
                scaleCount={scaleCount}
                setCursor={handleSetCursor}
                cursorTime={cursorTime}
                editorData={editorData}
                areaRef={areaRef}
                scrollSync={scrollSync}
                deltaScrollLeft={autoScroll && handleDeltaScrollLeft}
              />
            )}
          </>
        )}
      </ScrollSync>
    </div>
  );
});
