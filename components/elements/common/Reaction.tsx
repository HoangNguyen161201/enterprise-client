import { motion } from 'framer-motion';
import { IFilter } from 'models/elementType';
import React from 'react';

export const Reaction = ({icon, name, handleCReaction}: {icon: string, name: string, handleCReaction: (option: Partial<IFilter>)=> void}) => {
  return (
    <motion.div
    whileTap={{
      backgroundColor: '#009F9D',
      scale: 0.9,

  }} whileHover={{
      backgroundColor: '#009F9D80',
      scale: 1.1,
  }}
    onClick={()=> {
      if(name == 'Dislike') return handleCReaction({
          icon: '👎',
          _reaction: '621b2e96fafde5326f09db29',
        })
      return handleCReaction({
          icon: '👍🤣',
          _reaction: '621b2e96fafde5326f09db29',
          _interactive: 1
        })
    }}
      style={{
        paddingLeft: '22px',
        height: '35px',
        cursor: 'pointer',
        borderRadius: 5,
        lineHeight: '35px'
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
