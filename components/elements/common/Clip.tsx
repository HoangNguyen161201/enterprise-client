import React from 'react'

export const Clip = ({color, top, left, right}: {color: string, top?: number, left?: number, right?: number}) => {
  return (
    <div style={{
        width: 10,
        height: 30,
        background: color,
        position: 'absolute',
        top,
        left,
        right,
        borderRadius: 3
      }}>
      </div>
    
  )
}
