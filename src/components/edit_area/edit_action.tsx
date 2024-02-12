import React, { FC, useLayoutEffect, useState } from 'react';
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
  effects,
  rowHeight,
  scale,
  scaleWidth,
  startLeft,

  getActionRender,
}) => {
  const { end, start, selected, effectId } = action;

  // 初始化动作坐标数据
  const [transform, setTransform] = useState(() => {
    return parserTimeToTransform({ start, end }, { startLeft, scale, scaleWidth });
  });

  useLayoutEffect(() => {
    setTransform(parserTimeToTransform({ start, end }, { startLeft, scale, scaleWidth }));
  }, [end, start, startLeft, scaleWidth, scale]);

  // 动作的名称
  const classNames = ['action'];
  if (selected) classNames.push('action-selected');
  if (effects[effectId]) classNames.push(`action-effect-${effectId}`);


  const nowAction = {
    ...action,
    ...parserTransformToTime({ left: transform.left, width: transform.width }, { startLeft, scaleWidth, scale }),
  };

  const nowRow: TimelineRow = {
    ...row,
    actions: [...row.actions],
  };
  if (row.actions.includes(action)) {
    nowRow.actions[row.actions.indexOf(action)] = nowAction;
  }

  return (
    <div
      className={prefix((classNames || []).join(' '))}
      style={{ height: rowHeight, width: transform.width, left: transform.left }}
    >
      {getActionRender && getActionRender(nowAction, nowRow)}
    </div>
  );
};
