import { CloseOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import Image from 'next/image';
import * as React from 'react';

export interface IItemFileUploadProps {
  src: string;
  fileName: string;
  onRemoveFile?: (index: number) => void;
  index: number;
  url_file?: string;
}

export default function ItemFileUpload({
  src,
  fileName,
  onRemoveFile,
  index,
  url_file,
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
        <Image alt={'file_upload'} src={src} width={50} />
        {url_file ? (
          <div>
            <a className='color-3' href={url_file} download>{fileName}</a>
          </div>
        ) : (
          <div>{fileName}</div>
        )}
      </Space>
      {onRemoveFile && (
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
      )}
    </Space>
  );
}
