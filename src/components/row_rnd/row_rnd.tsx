import { Interactable } from '@interactjs/core/Interactable';
import { DragEvent } from '@interactjs/types';
import React, { ReactElement, useEffect, useImperativeHandle, useRef } from 'react';
import { DEFAULT_ADSORPTION_DISTANCE, DEFAULT_MOVE_GRID, DEFAULT_START_LEFT } from '@/interface/const';
import { useAutoScroll } from './hooks/useAutoScroll';
import { InteractComp } from './interactable';
import { RowRndApi, RowRndProps } from './row_rnd_interface';

export const RowDnd = React.forwardRef<RowRndApi, RowRndProps>(
  (
    {
      children,
      edges,
      left,
      width,

      start = DEFAULT_START_LEFT,
      grid = DEFAULT_MOVE_GRID,
      bounds = {
        left: Number.MIN_SAFE_INTEGER,
        right: Number.MAX_SAFE_INTEGER,
      },
      enableDragging = true,
      adsorptionDistance = DEFAULT_ADSORPTION_DISTANCE,
      adsorptionPositions = [],
      onDragStart,
      onDragEnd,
      onDrag,
      parentRef,
      deltaScrollLeft,
    },
    ref,
  ) => {
    const interactable = useRef<Interactable>();
    const deltaX = useRef(0);
    const isAdsorption = useRef(false);
    const { initAutoScroll, dealDragAutoScroll, stopAutoScroll } = useAutoScroll(parentRef);

    useEffect(() => {
      return () => {
        interactable.current && interactable.current.unset();
      };
    }, []);

    //#region [rgba(100,120,156,0.08)] 赋值相关api
    useImperativeHandle(ref, () => ({
      updateLeft: (left) => handleUpdateLeft(left || 0, false),
      updateWidth: (width) => handleUpdateWidth(width, false),
      getLeft: handleGetLeft,
      getWidth: handleGetWidth,
    }));
    useEffect(() => {
      const target = interactable.current.target as HTMLElement;
      handleUpdateWidth(typeof width === 'undefined' ? target.offsetWidth : width, false);
    }, [width]);
    useEffect(() => {
      handleUpdateLeft(left || 0, false);
    }, [left]);

    const handleUpdateLeft = (left: number, reset = true) => {
      if (!interactable.current || !interactable.current.target) return;
      reset && (deltaX.current = 0);
      const target = interactable.current.target as HTMLElement;
      target.style.left = `${left}px`;
      Object.assign(target.dataset, { left });
    };
    const handleUpdateWidth = (width: number, reset = true) => {
      if (!interactable.current || !interactable.current.target) return;
      reset && (deltaX.current = 0);
      const target = interactable.current.target as HTMLElement;
      target.style.width = `${width}px`;
      Object.assign(target.dataset, { width });
    };
    const handleGetLeft = () => {
      const target = interactable.current.target as HTMLElement;
      return parseFloat(target?.dataset?.left || '0');
    };
    const handleGetWidth = () => {
      const target = interactable.current.target as HTMLElement;
      return parseFloat(target?.dataset?.width || '0');
    };
    //#endregion

    //#region [rgba(188,188,120,0.05)] 回调api
    const handleMoveStart = () => {
      deltaX.current = 0;
      isAdsorption.current = false;
      initAutoScroll();
      onDragStart && onDragStart();
    };

    const move = (param: { preLeft: number; preWidth: number; scrollDelta?: number }) => {
      const { preLeft, preWidth, scrollDelta } = param;
      const distance = isAdsorption.current ? adsorptionDistance : grid;
      if (Math.abs(deltaX.current) >= distance) {
        const count = parseInt(deltaX.current / distance + '');
        let curLeft = preLeft + count * distance;

        // 控制吸附
        let adsorption = curLeft;
        let minDis = Number.MAX_SAFE_INTEGER;
        adsorptionPositions.forEach((item) => {
          const dis = Math.abs(item - curLeft);
          if (dis < adsorptionDistance && dis < minDis) adsorption = item;
          const dis2 = Math.abs(item - (curLeft + preWidth));
          if (dis2 < adsorptionDistance && dis2 < minDis) adsorption = item - preWidth;
        });

        if (adsorption !== curLeft) {
          // 采用吸附数据
          isAdsorption.current = true;
          curLeft = adsorption;
        } else {
          // 控制网格
          if ((curLeft - start) % grid !== 0) {
            curLeft = start + grid * Math.round((curLeft - start) / grid);
          }
          isAdsorption.current = false;
        }
        deltaX.current = deltaX.current % distance;

        // 控制bounds
        if (curLeft < bounds.left) curLeft = bounds.left;
        else if (curLeft + preWidth > bounds.right) curLeft = bounds.right - preWidth;

        if (onDrag) {
          const ret = onDrag(
            {
              lastLeft: preLeft,
              left: curLeft,
              lastWidth: preWidth,
              width: preWidth,
            },
            scrollDelta,
          );
          if (ret === false) return;
        }

        handleUpdateLeft(curLeft, false);
      }
    };

    const handleMove = (e: DragEvent) => {
      const target = e.target;

      if (deltaScrollLeft && parentRef?.current) {
        const result = dealDragAutoScroll(e, (delta) => {
          deltaScrollLeft(delta);

          let { left, width } = target.dataset;
          const preLeft = parseFloat(left);
          const preWidth = parseFloat(width);
          deltaX.current += delta;
          move({ preLeft, preWidth, scrollDelta: delta });
        });
        if (!result) return;
      }

      let { left, width } = target.dataset;
      const preLeft = parseFloat(left);
      const preWidth = parseFloat(width);

      deltaX.current += e.dx;
      move({ preLeft, preWidth });
    };

    const handleMoveStop = (e: DragEvent) => {
      deltaX.current = 0;
      isAdsorption.current = false;
      stopAutoScroll();

      const target = e.target;
      let { left, width } = target.dataset;
      onDragEnd && onDragEnd({ left: parseFloat(left), width: parseFloat(width) });
    };
    //#endregion

    return (
      <InteractComp
        interactRef={interactable}
        draggable={enableDragging}
        draggableOptions={{
          lockAxis: 'x',
          onmove: handleMove,
          onstart: handleMoveStart,
          onend: handleMoveStop,
          cursorChecker: () => {
            return null;
          },
        }}
      >
        {React.cloneElement(children as ReactElement, {
          style: {
            ...((children as ReactElement).props.style || {}),
            left,
            width,
          },
        })}
      </InteractComp>
    );
  },
);
