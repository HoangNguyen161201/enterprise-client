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
            placeholder="Enter you text"
            modules={{
                toolbar: [
                ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                ['blockquote', 'code-block'],

                [{ header: 1 }, { header: 2 }], // custom button values
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
                [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
                [{ direction: 'rtl' }], // text direction

                [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
                [{ header: [1, 2, 3, 4, 5, 6, false] }],

                [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                [{ font: [] }],
                [{ align: [] }],

                ['clean'], // remove formatting button
                ],
            }}
            value={editorVl}
            onChange={handleChange}
            />
       
    </>
  );
}
