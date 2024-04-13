import React, { FC } from 'react';
import { TimelineRow } from '@/interface/action';
import { prefix } from '@/utils/deal_class_prefix';
import { EditAction, ExternalEditActionProps } from './edit_action';
import './edit_row.less';

export type ExternalEditRowProps = ExternalEditActionProps

type InternalEditRowProps =  {
  rowData?: TimelineRow;
  style?: React.CSSProperties;
};

const EditRowComponent: FC<ExternalEditRowProps & InternalEditRowProps> = (props) => {
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

export const EditRow = React.memo(EditRowComponent, arePropsEqual);

function arePropsEqual(oldProps: ExternalEditRowProps & InternalEditRowProps, newProps: ExternalEditRowProps & InternalEditRowProps) {
  if (oldProps.rowData !== newProps.rowData) {
    return false;
  }

  if (oldProps.startLeft !== newProps.startLeft) {
    return false;
  }

  if (oldProps.scale !== newProps.scale) {
    return false;
  }

  if (oldProps.scaleWidth !== newProps.scaleWidth) {
    return false;
  }

  if (oldProps.getActionRender !== newProps.getActionRender) {
    return false;
  }

  if (oldProps.rowHeight !== newProps.rowHeight) {
    return false;
  }

  if (Object.keys(oldProps.style).length !== Object.keys(newProps.style).length) {
    return false;
  }

  return Object.keys(oldProps.style).every((oldStyleKey: string) => oldProps.style[oldStyleKey] === newProps.style[oldStyleKey]);
}
