import { Drawer, Image, Space } from 'antd';
import React from 'react';
import Skeletons from './Skeletons';

interface IDawerImg {
  imgs: Array<string> | null;
  isOpen: boolean;
  close: () => void;
  setImg: (img: string) => void;
}
export default function DrawerImg({ imgs, isOpen, close, setImg }: IDawerImg) {
  return (
    <Drawer title="Images" closable onClose={() => close()} visible={isOpen}>
      <Space direction="vertical">
        {imgs ? (
          imgs.map((item, key) => (
            <Image
              alt={`img_${key}`}
              style={{
                cursor: 'pointer',
              }}
              preview={false}
              onClick={() => setImg(item)}
              loading="lazy"
              src={item}
              key={key}
            />
          ))
        ) : (
          <Skeletons />
        )}
      </Space>
    </Drawer>
  );
}
