import { Spin } from 'antd';
import { GlobalContext } from 'contextApi/globalContext';
import { useContext } from 'react';
import { NextLayout } from '../../models/layoutType';

export const EmptyLayout: NextLayout = ({ children }) => {
  const { loadPage } = useContext(GlobalContext);
  return (
    <Spin spinning={loadPage}>
      <div>{children}</div>
    </Spin>
  );
};
