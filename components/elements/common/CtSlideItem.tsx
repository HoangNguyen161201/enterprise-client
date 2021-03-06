import { motion } from 'framer-motion';
import { IFilter } from 'models/elementType';
import { ICategoryForm } from 'models/formType';
import React from 'react';

export const CtSlideItem = ({ct, handleCReaction, nameById}: {ct: ICategoryForm, handleCReaction: (data:Partial<IFilter>)=> void, nameById: string | undefined})=> {
  return (
    <motion.div whileTap={{
        backgroundColor: '#009F9D',
        scale: 0.9,

    }} whileHover={{
        backgroundColor: '#009F9D80',
        scale: 1.1,
    }}
    onClick={()=> {
        handleCReaction({
            _nameById: nameById,
            _valueById: ct._id,
            icon: '👁'
        })
    }}
      style={{
        fontWeight: 500,
        height: 35,
        color: '#07456f',
        lineHeight: '35px',
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
