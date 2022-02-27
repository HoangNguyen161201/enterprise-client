import { motion } from 'framer-motion';
import { IFilter } from 'models/elementType';
import React from 'react';

export const Reaction = ({icon, name, id, handleCReaction}: {icon: string, name: string, id: string, handleCReaction: (option: Partial<IFilter>)=> void}) => {
  return (
    <motion.div
    whileTap={{
      backgroundColor: '#009F9D',
      color: 'white',
      scale: 0.9,

  }} whileHover={{
      backgroundColor: '#009F9D80',
      color: 'white',
      scale: 1.1,
  }}
    onClick={()=> {
        handleCReaction({
          id,
          icon
        })
    }}
      style={{
        paddingLeft: '22px',
        height: '40px',
        cursor: 'pointer',
        borderRadius: 10
      }}
    >
      <span
        className="font-4"
        style={{
          marginRight: 5,
        }}
      >
        {icon}
      </span>
      <span className="font-2">{name}</span>
    </motion.div>
  );
};
