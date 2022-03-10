import { Drawer, Grid, Image, Space } from 'antd';
import React from 'react';
import {Skeletons} from '../common';

interface IDawerImg {
  imgs: Array<string> | null;
  isOpen: boolean;
  close: () => void;
  setImg: (img: string) => void;
}
export const DrawerImg = ({ imgs, isOpen, close, setImg }: IDawerImg) => {

  const {useBreakpoint: UseBreakpoint} = Grid
  const {sm} = UseBreakpoint()

  return (
    <Drawer width={sm? undefined: '100%'} title="Images" closable onClose={() => close()} visible={isOpen}>
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
