import { Breadcrumb } from 'antd';
import { GlobalContext } from 'contextApi/globalContext';
import { IBreadCrumb } from 'models/elementType';
import Link from 'next/link';
import React, { useContext } from 'react';

export const BreadCrumb = ({ data, main }: IBreadCrumb) => {
  const { desColor, color } = useContext(GlobalContext);
  return (
    <>
      {main && (
        <Breadcrumb>
          {data.map((item) => (
            <Breadcrumb.Item key={item.label}>
              <Link href={item.url}>
                <a className={`${desColor}`}>{item.label}</a>
              </Link>
            </Breadcrumb.Item>
          ))}

          <Breadcrumb.Item>
            <Link href={main.url}>
              <a className={`${color}`}>{main.label}</a>
            </Link>
          </Breadcrumb.Item>
        </Breadcrumb>
      )}
    </>
  );
};
