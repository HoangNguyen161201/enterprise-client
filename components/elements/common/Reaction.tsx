import React from 'react';

export const Reaction = ({icon, name, id, handleCReaction}: {icon: string, name: string, id: string, handleCReaction: (id: string)=> void}) => {
  return (
    <div
    onClick={()=> {
        handleCReaction(id)
    }}
      style={{
        paddingLeft: '22px',
        height: '40px',
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
