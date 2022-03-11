import { Breadcrumb } from 'antd';
import { GlobalContext } from 'contextApi/globalContext';
import { IBreadCrumb } from 'models/elementType';
import Link from 'next/link';
import React, { useContext } from 'react';
import { LinkSpin } from './LinkSpin';

export const BreadCrumb = ({ data, main }: IBreadCrumb) => {
  const { desColor, color } = useContext(GlobalContext);
  return (
    <>
      {main && (
        <Breadcrumb>
          {data.map((item) => (
            <Breadcrumb.Item key={item.label}>
              <LinkSpin url={item.url} className={`${desColor}`} name={item.label} />
            </Breadcrumb.Item>
          ))}

          <Breadcrumb.Item>
            <LinkSpin url={main.url} className={`${color}`} name={main.label} />
          </Breadcrumb.Item>
        </Breadcrumb>
      )}
    </>
  );
};
