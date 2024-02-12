import React, { FC } from 'react';
import { TimelineRow } from '@/interface/action';
import { CommonProp } from '@/interface/common_prop';
import { prefix } from '@/utils/deal_class_prefix';
import { EditAction } from './edit_action';
import './edit_row.less';

export type EditRowProps = CommonProp & {
  rowData?: TimelineRow;
  style?: React.CSSProperties;
};

export const EditRow: FC<EditRowProps> = (props) => {
  const {
    rowData,
    style = {},
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
          key={action.id}
          {...props}
          row={rowData}
          action={action}
        />
      ))}
    </div>
  );
};
