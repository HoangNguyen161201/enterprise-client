//Import
import { CloudUploadOutlined, FileTextOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Breadcrumb, Button, Card, Col, message, Row, Space, Spin, Switch } from 'antd';
import { AxiosError } from 'axios';
import ItemFileUpload from 'components/elements/common/ItemFileUpload';
import RowTable from 'components/elements/common/RowTable';
import { Input, Select, TextArea } from 'components/elements/form';
import { ClientLayout } from 'components/layouts';
import { IallCategories, ICommon, IDetailSubmission } from 'models/apiType';
import { IOptionSelect } from 'models/elementType';
import { ICategoryForm, IIdeaForm, IUserForm } from 'models/formType';
import { NextPageWithLayout } from 'models/layoutType';
import { fileMutation } from 'mutations/file';
import { IdeaMutaion } from 'mutations/idea';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getCurrentUser, getDetailSubmission } from 'queries';
import { getallCategories } from 'queries/category';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import 'react-quill/dist/quill.bubble.css';
//CSS
import 'react-quill/dist/quill.snow.css';
import { dataTypeFile } from 'utils/dataTypeFile';
import { uploadFile } from 'utils/uploadFile';
import { validateAddUser, validateCategory } from 'utils/validate';
import { v4 as uuidv4 } from 'uuid';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export interface IDetailSubmissionProps {
  detailSubmission: IDetailSubmission;
  allCategories: IallCategories;
}

const DetailSubmission: NextPageWithLayout = ({
  detailSubmission,
  allCategories,
}: IDetailSubmissionProps) => {
  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();
  useEffect(() => {
    dataUserRefetch();
  }, []);

  //  Mutation call api to add file
  const mutationDeleteFiles = fileMutation.delete({
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Delete files false.',
        });
      },
    },
  });

  //  Mutation call api to add idea
  const mutationAddIdea = IdeaMutaion.add({
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Add Idea false.',
        });
      },
    },
    dataUserRefetch: dataUserRefetch,
    token: dataUser?.accessToken.token,
  });

  ///Initial data upload ideal
  const [editorVl, setEditorVl] = useState('');
  const [categoriesSelect, setCategoriesSelect] = useState<IOptionSelect[]>([]);
  const [filesUpload, setFilesUpload] = useState<File[]>([]);
  const [anonymously, setAnonymously] = useState<boolean>(false);

  //Handle change content editor
  const handleChange = (value: any) => {
    setEditorVl(value);
  };

  //State show form submit idea
  const [isShowFormIdea, setIsShowFormIdea] = useState<boolean>(false);

  //State loading submit files
  const [isLoadUpFile, setIsLoadUpFile] = useState<boolean>(false);

  //State date
  const [timeClosure, setTimeClosure] = useState({
    closure_date: {
      value: '',
      isMatchDate: false,
    },
    final_closure_date: {
      value: '',
      isMatchDate: false,
    },
  });

  //Get id from router to get old data
  const {
    query: { id },
  } = useRouter();

  //Get detail data submission
  const { error: errorSubmission, data: dataDetailSubmission } = getDetailSubmission(
    id as string,
    dataUser?.accessToken.token as string,
    detailSubmission
  );

  //Get all data categories
  const {
    error: errorAllCategories,
    data: dataAllCategories,
    refetch: rfCategories,
  } = getallCategories(dataUser?.accessToken.token, allCategories);
  //Set data select departmen
  useEffect(() => {
    if (dataAllCategories && dataAllCategories.categories) {
      const valueSetCategorySl: IOptionSelect[] = dataAllCategories.categories.map((category) => {
        return {
          value: category._id,
          label: category.name,
        };
      });

      setCategoriesSelect(valueSetCategorySl);
    }
  }, [dataAllCategories]);

  //Set closure date when have data detail submission
  useEffect(() => {
    if (dataDetailSubmission) {
      setTimeClosure({
        closure_date: {
          value: new Date(dataDetailSubmission.submission.closure_date).toString(),
          isMatchDate: new Date(dataDetailSubmission.submission.closure_date) > new Date(),
        },
        final_closure_date: {
          value: new Date(dataDetailSubmission.submission.final_closure_date).toString(),
          isMatchDate: new Date(dataDetailSubmission.submission.final_closure_date) > new Date(),
        },
      });
    }
  }, [dataDetailSubmission]);

  //Check exist and show error
  useEffect(() => {
    if (errorGetUser) {
      message.error({
        content: errorGetUser.response?.data.err,
      });
    }
  }, [errorGetUser]);

  useEffect(() => {
    if (errorSubmission) {
      message.error({
        content: errorSubmission.response?.data.err,
      });
    }
  }, [errorSubmission]);

  useEffect(() => {
    if (errorAllCategories) {
      message.error({
        content: errorAllCategories.response?.data.err,
      });
    }
  }, [errorAllCategories]);

  //Setting data file submit
  const onDrop = useCallback((acceptedFiles: File[]) => {
    //Check size
    let isValidSize = true;
    acceptedFiles.forEach((file) => {
      if (file.size >= 10485760) {
        isValidSize = false;
      }
    });

    if (isValidSize) {
      setFilesUpload(acceptedFiles);
    } else {
      message.error({
        content: 'Each file should be less than 10MB in size.',
      });
    }
  }, []);

  //Setting files uploads
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  //handle change show form upload file
  const onChangeShowForm = () => {
    setIsShowFormIdea(!isShowFormIdea);
  };

  //Remove file upload
  const onRemoveFile = (index: number) => {
    console.log(index);

    const newFilesUpload = filesUpload.filter((file, indexFile) => {
      if (indexFile !== index) {
        return file;
      }
    });
    setFilesUpload(newFilesUpload);
  };

  //Generate img type file
  const generateImgFile = (nameFile: string) => {
    let typeFile = nameFile.split('.')[1];
    if (!dataTypeFile.includes(typeFile)) {
      typeFile = 'other';
    }

    return `/assets/files/${typeFile}.svg`;
  };

  // setting form
  const formSetting = useForm<IIdeaForm>({
    resolver: yupResolver(validateCategory),
    defaultValues: {
      title: '',
      category_id: '',
      description: '',
    },
  });

  const onSubmitFormAddIdea = async (dataForm: ICategoryForm) => {
    if (!editorVl) {
      message.error({
        content: 'Please enter field content idea.',
      });
    } else {
      //Handle submit file
      let files = [];

      //Set cloud dinary id files
      const cloudinary_id = uuidv4();

      if (filesUpload && filesUpload.length !== 0) {
        setIsLoadUpFile(true);

        //Up files
        files = await uploadFile(filesUpload, [
          detailSubmission.submission._id,
          dataUser?.user._id,
          cloudinary_id,
        ]);

        setIsLoadUpFile(false);
      }

      //Set again data form
      const newDataForm = {
        user_id: dataUser?.user._id,
        submission_id: dataDetailSubmission?.submission._id,
        anonymously,
        files,
        content: editorVl,
        cloudinary_id,
        ...dataForm,
      };

      mutationAddIdea.mutate(newDataForm);

      //Clear Idea
      onClearData();
    }
  };

  //Clear data update
  const onClearData = () => {
    formSetting.reset({
      title: '',
      description: '',
      category_id: '',
    });
    setEditorVl('');
    setFilesUpload([]);
  };

  return (
    <>
      <Head>
        <title>Detail Submission Page</title>
      </Head>

      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Submission</Breadcrumb.Item>
        <Breadcrumb.Item>All Submission</Breadcrumb.Item>
        <Breadcrumb.Item>View Detail Submission</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="View Detail Employee" style={{ width: '100%', marginTop: '20px' }}>
        <Space direction="vertical" size={20}>
          <span
            style={{
              fontSize: 14,
              color: 'gray',
            }}
          >
            Information
          </span>
          <RowTable title="Name" value={dataDetailSubmission?.submission.name} />
          <RowTable title="Description" value={dataDetailSubmission?.submission.description} />
          <RowTable
            title="Closure Date"
            value={timeClosure.closure_date.value}
            isValid={timeClosure.closure_date.isMatchDate}
          />
          <RowTable
            title="Closure Date"
            value={timeClosure.final_closure_date.value}
            isValid={timeClosure.final_closure_date.isMatchDate}
          />

          <Button
            icon={<CloudUploadOutlined />}
            type="primary"
            danger={isShowFormIdea}
            size="large"
            style={{
              borderRadius: 5,
              margin: '20px 0px',
            }}
            onClick={onChangeShowForm}
          >
            {isShowFormIdea ? 'Cancel up idea' : 'Add your idea'}
          </Button>

          {/* Form upload file */}
          <Space
            direction="vertical"
            size={20}
            style={{
              width: '100%',
              display: isShowFormIdea ? undefined : 'none',
            }}
          >
            <span
              style={{
                fontSize: 14,
                color: 'gray',
              }}
            >
              Detail your idea
            </span>

            <form id="submitIdea" onSubmit={formSetting.handleSubmit(onSubmitFormAddIdea)}>
              <Space direction="vertical" size={20}>
                <Row gutter={[20, 20]}>
                  <Col xs={24} sm={24} md={12}>
                    <Input
                      name="title"
                      label="Title"
                      formSetting={formSetting}
                      placeholder="Enter name"
                      type="text"
                      icon={<FileTextOutlined />}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <Select
                      formSetting={formSetting}
                      name="category_id"
                      label="Category"
                      placeholder="Please select category"
                      data={categoriesSelect}
                      require={false}
                    />
                  </Col>
                  <Col xs={24}>
                    <TextArea
                      name="description"
                      label="Description"
                      formSetting={formSetting}
                      placeholder="Enter description"
                      type="email"
                      icon={<FileTextOutlined />}
                    />
                  </Col>
                </Row>
                <Space direction="vertical">
                  <span>Anonymously author information</span>
                  <Switch checked={anonymously} onChange={(e) => setAnonymously(e)} />
                </Space>
              </Space>
            </form>

            <ReactQuill
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

            <span
              style={{
                fontSize: 14,
                color: 'gray',
              }}
            >
              Upload file
            </span>
            <Spin spinning={isLoadUpFile}>
              <Space
                style={{
                  width: '100%',
                  border: '5px dotted #009F9D30',
                  padding: '40px 40px',
                  borderRadius: '20px',
                  justifyContent: 'center',
                }}
                direction="vertical"
                align="center"
                size={20}
                {...getRootProps()}
              >
                <img src="/assets/uploadFiles.svg" />
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: 'gray',
                    }}
                  >
                    Drop the files here ...
                  </p>
                ) : (
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: 'gray',
                    }}
                  >
                    Drag your documents, photos, or videos here to start uploading
                  </p>
                )}
                <Button
                  type="primary"
                  size="large"
                  style={{
                    borderRadius: 4,
                  }}
                >
                  Choose Files
                </Button>
              </Space>
            </Spin>

            {filesUpload.map((file, index) => (
              <Spin spinning={isLoadUpFile} key={index}>
                <ItemFileUpload
                  src={generateImgFile(file.name)}
                  fileName={file.name}
                  index={index}
                  onRemoveFile={onRemoveFile}
                />
              </Spin>
            ))}

            <Button
              loading={isLoadUpFile || mutationAddIdea.isLoading}
              style={{
                borderRadius: 5,
              }}
              htmlType="submit"
              form={'submitIdea'}
              type="primary"
              icon={<CloudUploadOutlined />}
            >
              Submit
            </Button>
          </Space>
        </Space>
      </Card>
    </>
  );
};

DetailSubmission.getLayout = ClientLayout;

export default DetailSubmission;

export const getServerSideProps: GetServerSideProps = async (context) => {
  //Check login
  const res: any = await fetch(`http://localhost:3000/api/auth/accesstoken`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  });
  const dataAccess = await res.json();

  //Redirect login page when error
  if (dataAccess.statusCode !== 200) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  //Check role
  if (dataAccess.user.role !== 'admin') {
    return {
      notFound: true,
    };
  }

  const detailSubmission: IDetailSubmission = await fetch(
    `http://localhost:3000/api/submissions/${context.query.id}`,
    {
      method: 'GET',
      headers: {
        cookie: context.req.headers.cookie,
        authorization: dataAccess.accessToken.token,
      } as HeadersInit,
    }
  ).then((e) => e.json());

  console.log(detailSubmission);
  

  //Redirect 404 page when not have submission
  if (detailSubmission.statusCode === 200) {
    return {
      notFound: true,
    };
  }

  //Get all data categories
  const allCategories: IallCategories = await fetch(`http://localhost:3000/api/categories`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  }).then((e) => e.json());

  return {
    props: {
      detailSubmission,
      allCategories,
    },
  };
};
