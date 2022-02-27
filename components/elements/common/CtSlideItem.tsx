import { motion } from 'framer-motion';
import { IFilter } from 'models/elementType';
import { ICategoryForm } from 'models/formType';
import React from 'react';

export const CtSlideItem = ({ct, handleCReaction}: {ct: ICategoryForm, handleCReaction: (data:Partial<IFilter>)=> void})=> {
  return (
    <motion.div whileTap={{
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
            _nameById: 'category_id',
            _valueById: ct._id,
            icon: '👁'
        })
    }}
      style={{
        fontWeight: 500,
        height: 40,
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
    </motion.div>
  );
}
