import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });


export default function editor() {
  const [editorVl, setEditorVl] = useState('<p>fdfgdfdfgdf</p>');
  const handleChange = (value: any) => {
    setEditorVl(value)
  };

  return (
    <>

            <ReactQuill
            theme='bubble'
            style={{
                minHeight: 200,
            }}
            value={editorVl}
            readOnly
            />
       
    </>
  );
}
