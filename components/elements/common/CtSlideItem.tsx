import { ICategoryForm } from 'models/formType';
import React from 'react';

export default function CtSlideItem({ct}: {ct: ICategoryForm}) {
  return (
    <div
      style={{
        fontWeight: 500,
        height: 40,
        // background: 'black',
        color: '#07456f',
        lineHeight: '40px',
        paddingLeft: 22,
        borderRadius: 5,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        paddingRight: '15px',
        cursor: 'pointer',
      }}
    >
      {ct.name}
    </div>
  );
}
