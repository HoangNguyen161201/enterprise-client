import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { uploadFile as Upload } from 'utils/uploadFile'
export default function uploadFile() {
  
  const [fileUpload, setFileUpload] = useState<any>('')
  const update = async (data: any) => {
    const result = await Upload(data, ['fsafa', 'hoang'])
    console.log(result)
  }

  return (
    <>
    <input onChange={(event)=> {
      setFileUpload(Object.values(event.target.files as any))
    }} type={'file'} multiple/>
    <button onClick={()=> update(fileUpload) }>Enter update</button>
    </>
  )
}
