import React, { FC } from 'react';
import { TimelineRow } from '@/interface/action';
import { prefix } from '@/utils/deal_class_prefix';
import { EditAction, ExternalEditActionProps } from './edit_action';
import './edit_row.less';

export type ExternalEditRowProps = ExternalEditActionProps

export type InternalEditRowProps =  {
  rowData?: TimelineRow;
  style?: React.CSSProperties;
};

export const EditRow: FC<ExternalEditRowProps & InternalEditRowProps> = (props) => {
  const {
    rowData,
    style = {},
    rowHeight,
    scaleWidth,
    scale,
    startLeft,
    getActionRender
  } = props;

  const classNames = ['edit-row'];
  if (rowData?.selected) classNames.push('edit-row-selected');

  return (
    <div
      className={`${prefix(...classNames)} ${(rowData?.classNames || []).join(
        ' ',
      )}`}
      style={style}
    >
      {(rowData?.actions || []).map((action) => (
        <EditAction
          rowHeight={rowHeight}
          scaleWidth={scaleWidth}
          scale={scale}
          startLeft={startLeft}
          getActionRender={getActionRender}
          key={action.id}
          row={rowData}
          action={action}
        />
      ))}
    </div>
  );
};
