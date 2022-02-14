import * as React from 'react';
import { Drawer } from 'antd';

export default function DrawerComponent(props: any) {
  return (
    <>
      <Drawer {...props}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  );
}
