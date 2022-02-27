import { IFilter } from 'models/elementType';
import React from 'react';

export const Reaction = ({icon, name, id, handleCReaction}: {icon: string, name: string, id: string, handleCReaction: (option: IFilter)=> void}) => {
  return (
    <div
    onClick={()=> {
        handleCReaction({
          id,
          icon
        })
    }}
      style={{
        paddingLeft: '22px',
        height: '40px',
        cursor: 'pointer'
      }}
    >
      <span
        className="font-4"
        style={{
          marginRight: 10,
        }}
      >
        {icon}
      </span>
      <span className="font-2">{name}</span>
    </div>
  );
};
