import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Card, Tooltip } from 'antd';
import * as React from 'react';

export interface IItemDraftProps {
  draft: any;
  index: number;
  onDeleteDraft: (index: number) => void;
  onUseDraft: (draft: any, index: number) => void;
}

export const ItemDraft = ({ draft, index, onDeleteDraft, onUseDraft }: IItemDraftProps) => {
  return (
    <Card
      size="small"
      actions={[
        <DeleteOutlined key="delete" onClick={() => onDeleteDraft(index)} />,
        <EditOutlined key="edit" onClick={() => onUseDraft(draft, index)} />,
      ]}
    >
      <Tooltip title={draft.title}>
        <div
          style={{
            maxWidth: '200px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontWeight: 'bold',
          }}
        >
          {draft.title}
        </div>
      </Tooltip>
    </Card>
  );
};
