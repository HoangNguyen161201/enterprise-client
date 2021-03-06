import { CopyOutlined } from '@ant-design/icons';
import React from 'react';
import { ICopyAcc } from 'models/elementType';

export const CopyAcc = ({ acc, handleSetAcc }: ICopyAcc)=> {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span>{acc.role} account</span>
      <CopyOutlined
        onClick={() =>
          handleSetAcc({
            email: acc.email,
            password: acc.password,
          })
        }
        style={{ cursor: 'pointer', color: '#07456F' }}
        size={24}
      />
    </div>
  );
}
