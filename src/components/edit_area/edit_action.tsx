import React, { FC, ReactNode, useMemo } from 'react';
import { TimelineAction, TimelineRow } from '@/interface/action';
import { prefix } from '@/utils/deal_class_prefix';
import { parserTimeToTransform } from '@/utils/deal_data';
import './edit_action.less';

export type ExternalEditActionProps = {
  rowHeight: number,
  scale: number,
  scaleWidth: number,
  startLeft: number,
  getActionRender: (action: TimelineAction, row: TimelineRow, editActionParams?: {height: number, width: number, left: number, className: string}) => ReactNode;
}

type InternalEditActionProps = {
  row: TimelineRow;
  action: TimelineAction;
};

export const EditAction: FC<ExternalEditActionProps & InternalEditActionProps> = ({
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
