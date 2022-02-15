import { message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getDetailDepartment } from '../../../queries/department';

export interface IUpdateDepartmetnProps {}

export default function UpdateDepartmetn(props: IUpdateDepartmetnProps) {
  //Get id from router to get old data
  const {
    query: { id },
  } = useRouter();

  //Get old data department
  const { isError, error, data } = getDetailDepartment(id as string);

  useEffect(()=> {
      if(error) {
        message.error({
            content: error.response?.data.err
        })
      }
  }, [error])


  return <div>{data && data}</div>;
}
