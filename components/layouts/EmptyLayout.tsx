import { useState } from 'react';
import { NextLayout } from '../../models/layoutType';

export const EmptyLayout: NextLayout = ({ children }) => {
  const [clientX, setClientX] = useState(0)
  const [clientY, setClientY] = useState(0)
  const handleMove = (e: any)=> {
    setClientX(e.clientX)
    setClientY(e.clientY)
  }
  return (
    <div onMouseMove={handleMove}>
      {children}
    </div>
  );
};
