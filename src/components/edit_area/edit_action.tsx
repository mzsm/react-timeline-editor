import React, { FC, useLayoutEffect, useMemo, useState } from 'react';
import { TimelineAction, TimelineRow } from '@/interface/action';
import { CommonProp } from '@/interface/common_prop';
import { prefix } from '@/utils/deal_class_prefix';
import { parserTimeToTransform, parserTransformToTime } from '@/utils/deal_data';
import './edit_action.less';

export type EditActionProps = CommonProp & {
  row: TimelineRow;
  action: TimelineAction;
};

export const EditAction: FC<EditActionProps> = ({
  row,
  action,
  rowHeight,
  scale,
  scaleWidth,
  startLeft,

  getActionRender,
}) => {
  const { end, start, selected } = action;

  const transform = useMemo(() => parserTimeToTransform({ start, end }, { startLeft, scale, scaleWidth }), [end, start, startLeft, scaleWidth, scale]);

  // 动作的名称
  const classNames = ['action'];
  if (selected) classNames.push('action-selected');

  return (
    <div
      className={prefix((classNames || []).join(' '))}
      style={{ height: rowHeight, width: transform.width, left: transform.left }}
    >
      {getActionRender && getActionRender(action, row)}
    </div>
  );
};
