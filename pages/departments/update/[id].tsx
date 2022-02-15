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
  const { refetch, isError, error, data } = getDetailDepartment(id as string);

  refetch();

  //Check exist error and show erro
  useEffect(() => {
    if (isError) {
      message.error('This is an error message');
      console.log(error);
    }
  }, [isError]);
  return <div>{data && data}</div>;
}
