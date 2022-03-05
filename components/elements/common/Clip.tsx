import React from 'react'

export const Clip = ({color, top, left, right}: {color: string, top?: number, left?: number, right?: number}) => {
  return (
    <div className={color} style={{
        width: 10,
        height: 30,
        position: 'absolute',
        top,
        left,
        right,
        borderRadius: 3
      }}>
      </div>
    
  )
}
