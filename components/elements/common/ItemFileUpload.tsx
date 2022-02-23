import { CloseOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import * as React from 'react';

export interface IItemFileUploadProps {
  src: string;
  fileName: string;
  onRemoveFile: (index: number) => void;
  index: number;
}

export default function ItemFileUpload({
  src,
  fileName,
  onRemoveFile,
  index,
}: IItemFileUploadProps) {
  return (
    <Space
      size={20}
      style={{
        border: '1px solid #80808050',
        width: '100%',
        padding: '10px 20px',
        borderRadius: 5,
        justifyContent: 'space-between',
      }}
    >
      <Space size={20}>
        <img src={src} width={50} />
        <div>{fileName}</div>
      </Space>
      <Space>
        <Space
          align="center"
          style={{
            borderRadius: '50%',
            border: '2px solid #FF7070',
            width: 30,
            height: 30,
            justifyContent: 'center',
          }}
        >
          <CloseOutlined
            style={{
              color: '#FF7070',
            }}
            onClick={() => onRemoveFile(index)}
          />
        </Space>
      </Space>
    </Space>
  );
}
