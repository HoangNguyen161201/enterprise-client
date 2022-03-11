//Import
import { CloudUploadOutlined, FileTextOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Breadcrumb, Button, Card, Col, message, Row, Space, Spin, Switch } from 'antd';
import { AxiosError } from 'axios';
import ItemFileUpload from 'components/elements/common/ItemFileUpload';
import { Input, Select, TextArea } from 'components/elements/form';
import { ClientLayout } from 'components/layouts';
import { GlobalContext } from 'contextApi/globalContext';
import { IallCategories, ICommon, IDetailIdea, IDetailUser, IFileUpload } from 'models/apiType';
import { IOptionSelect } from 'models/elementType';
import { IIdeaForm } from 'models/formType';
import { NextPageWithLayout } from 'models/layoutType';
import { fileMutation } from 'mutations/file';
import { IdeaMutaion } from 'mutations/idea';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getCurrentUser, getDetailIdea } from 'queries';
import { getallCategories } from 'queries/category';
import { useCallback, useContext, useEffect as UseEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import 'react-quill/dist/quill.bubble.css';
//CSS
import 'react-quill/dist/quill.snow.css';
import { dataTypeFile } from 'utils/dataTypeFile';
import { uploadFile } from 'utils/uploadFile';
import { validateCategory } from 'utils/validate';
import { v4 as uuidv4 } from 'uuid';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export interface IDetailSubmissionProps {
  detailIdea: IDetailIdea;
  allCategories: IallCategories;
}

const DetailSubmission: NextPageWithLayout = ({
  detailIdea,
  allCategories,
}: IDetailSubmissionProps) => {
  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();
  UseEffect(() => {
    dataUserRefetch();
  }, []);

  const { color2, handleLoadPage } = useContext(GlobalContext);

  UseEffect(()=> {
    handleLoadPage(false)
  }, [])

  //State loading submit files
  const [isLoadUpFile, setIsLoadUpFile] = useState<boolean>(false);

  ///Initial data upload ideal
  const [editorVl, setEditorVl] = useState('');
  const [categoriesSelect, setCategoriesSelect] = useState<IOptionSelect[]>([]);
  const [filesUpload, setFilesUpload] = useState<File[]>([]);
  const [oldFilesUpload, setOldFilesUpload] = useState<IFileUpload[]>([]);
  const [oldFilesRemoveUpload, setOldFilesRemoveUpload] = useState<IFileUpload[]>([]);
  const [anonymously, setAnonymously] = useState<boolean>(false);

  //Handle change content editor
  const handleChange = (value: any) => {
    setEditorVl(value);
  };

  //Get id from router to get old data
  const {
    query: { id },
  } = useRouter();

  //Get detail data idea
  const {
    error: errorDetailIdea,
    data: dataDetailIdea,
    refetch: refetchDataDetailIdea,
  } = getDetailIdea(id as string, dataUser?.accessToken.token, detailIdea);

  //set again content, old files upload and anonymously when have idea
  UseEffect(() => {
    if (dataDetailIdea) {
      setEditorVl(dataDetailIdea.idea.content ? dataDetailIdea.idea.content : '');
      setAnonymously(dataDetailIdea.idea.anonymously ? dataDetailIdea.idea.anonymously : false);
      setOldFilesUpload(dataDetailIdea.idea.files ? dataDetailIdea.idea.files : []);
    }
  }, [dataDetailIdea]);

  //  Mutation call api to add file
  const mutationDeleteFiles = fileMutation.delete({
    options: {
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Delete files false.',
        });
      },
    },
  });

  //  Mutation call api to add idea
  const mutationUpdateIdea = IdeaMutaion.update({
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });

        //Remove old file
        oldFilesRemoveUpload.forEach((item) => {
          mutationDeleteFiles.mutate({ public_id: item.public_id });
        });

        //Reset data
        refetchDataDetailIdea();
        setFilesUpload([]);
        setOldFilesRemoveUpload([]);
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Update Idea false.',
        });
      },
    },
    dataUserRefetch: dataUserRefetch,
    token: dataUser?.accessToken.token,
  });

  //Get all data categories
  const {
    error: errorAllCategories,
    data: dataAllCategories,
    refetch: rfCategories,
  } = getallCategories(dataUser?.accessToken.token, allCategories);
  //Set data select departmen
  UseEffect(() => {
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

  //Check exist and show error
  UseEffect(() => {
    if (errorGetUser) {
      message.error({
        content: errorGetUser.response?.data.err,
      });
    }

    if (errorDetailIdea) {
      message.error({
        content: errorDetailIdea.response?.data.err,
      });
    }

    if (errorAllCategories) {
      message.error({
        content: errorAllCategories.response?.data.err,
      });
    }
  }, [errorGetUser, errorDetailIdea, errorAllCategories]);

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

  //Remove file upload
  const onRemoveFile = (index: number) => {
    const newFilesUpload = filesUpload.filter((file, indexFile) => {
      if (indexFile !== index) {
        return file;
      }
    });
    setFilesUpload(newFilesUpload);
  };

  //Remove file old upload
  const onRemoveFileOld = (index: number) => {
    //set old files upload to state will remove
    setOldFilesRemoveUpload([oldFilesUpload[index], ...oldFilesRemoveUpload]);

    const newOldFilesUpload = oldFilesUpload.filter((file, indexFile) => {
      if (indexFile !== index) {
        return file;
      }
    });
    setOldFilesUpload(newOldFilesUpload);
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
      title: dataDetailIdea?.idea?.title,
      category_id: dataDetailIdea?.idea?.category_id?._id
        ? dataDetailIdea?.idea.category_id._id
        : '',
      description: dataDetailIdea?.idea?.description,
    },
  });

  const onSubmitFormUpdateIdea = async (dataForm: IIdeaForm) => {
    if (!editorVl) {
      message.error({
        content: 'Please enter field content idea.',
      });
    } else {
      //Handle submit file
      let files: any[] = [];

      //Set cloud dinary id files
      const cloudinary_id = dataDetailIdea?.idea.cloudinary_id
        ? dataDetailIdea?.idea.cloudinary_id
        : uuidv4();

      if (filesUpload && filesUpload.length !== 0) {
        setIsLoadUpFile(true);

        //Up files
        files = await uploadFile(filesUpload, [dataUser?.user._id, cloudinary_id], false, `${dataUser?.user.email}-${cloudinary_id}`);
        setIsLoadUpFile(false);

        //Concact new files with old files upload
        files = files.concat(oldFilesUpload);
      }

      //Concact new files with old files upload
      files = oldFilesUpload.concat(files);

      //Set again data form
      const newDataForm = {
        ...dataForm,
        anonymously,
        files,
        content: editorVl,
        cloudinary_id: files.length !== 0 ? cloudinary_id : undefined,
        _id: dataDetailIdea?.idea._id,
      };

      //Update file
      mutationUpdateIdea.mutate(newDataForm);
    }
  };

  //Clear data update
  const onClearData = () => {
    setEditorVl(dataDetailIdea?.idea.content ? dataDetailIdea.idea.content : '');
    setAnonymously(dataDetailIdea?.idea.anonymously ? dataDetailIdea.idea.anonymously : false);
    setOldFilesUpload(dataDetailIdea?.idea.files ? dataDetailIdea.idea.files : []);
    setFilesUpload([]);
    setOldFilesRemoveUpload([]);

    formSetting.reset({
      title: dataDetailIdea?.idea?.title,
      category_id: dataDetailIdea?.idea?.category_id?._id
        ? dataDetailIdea?.idea.category_id._id
        : '',
      description: dataDetailIdea?.idea?.description,
    });
  };

  return (
    <>
      <Head>
        <title>Update Idea</title>
      </Head>

      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Ideas</Breadcrumb.Item>
        <Breadcrumb.Item>Update Idea</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        extra={<Button type={'link'} onClick={onClearData}>Reset</Button>}
        title="Update Your Idea"
        className="card-b shadow-l"
        style={{
          background: 'white',
        }}
      >
        <Space
          direction="vertical"
          size={20}
          style={{
            width: '100%',
          }}
        >
          {/* Form upload file */}
          <span
            style={{
              fontSize: 14,
              color: 'gray',
            }}
          >
            Detail your idea
          </span>

          <form id="submitIdea" onSubmit={formSetting.handleSubmit(onSubmitFormUpdateIdea)}>
            <Space direction="vertical" size={20}>
              <Row gutter={[20, 20]}>
                <Col xs={24} sm={24} md={12}>
                  <Input
                    dark={false}
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
                    dark={false}
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
                    dark={false}
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
            {`Old file upload (${dataDetailIdea?.idea?.files?.length} files)`}
          </span>

          {/* old file upload */}
          {oldFilesUpload.map((file, index) => (
            <Spin spinning={isLoadUpFile} key={index}>
              <ItemFileUpload
                src={generateImgFile(file.name)}
                fileName={file.name}
                index={index}
                onRemoveFile={onRemoveFileOld}
                url_file={file.url}
              />
            </Spin>
          ))}

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
              <img width={150} height={100} alt={'upload_img'} src="/assets/uploadFiles.svg" />
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
                className={`${color2}`}
                type="primary"
                style={{
                  borderRadius: 5,
                }}
              >
                Choose Files
              </Button>
            </Space>
          </Spin>

          {/* file upload */}
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
            className={`${color2}`}
            loading={isLoadUpFile || mutationUpdateIdea.isLoading}
            style={{
              borderRadius: 5,
            }}
            htmlType="submit"
            form={'submitIdea'}
            type="primary"
            icon={<CloudUploadOutlined />}
          >
            Save
          </Button>
        </Space>
      </Card>
    </>
  );
};

DetailSubmission.getLayout = ClientLayout;

export default DetailSubmission;

export const getServerSideProps: GetServerSideProps = async (context) => {
  //Check login
  const detailUser: IDetailUser = await fetch(`${process.env.CLIENT_URL}/api/auth/accesstoken`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  }).then((e) => e.json());

  //Redirect login page when error
  if (detailUser.statusCode !== 200) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  //Check role
  if (detailUser.user.role === 'admin') {
    return {
      notFound: true,
    };
  }

  const detailIdea: IDetailIdea = await fetch(
    `${process.env.CLIENT_URL}/api/ideas/${context.query.id}`,
    {
      method: 'GET',
      headers: {
        cookie: context.req.headers.cookie,
        authorization: detailUser.accessToken.token,
      } as HeadersInit,
    }
  ).then((e) => e.json());

  //Redirect 404 page when not have idea
  if (detailIdea.statusCode !== 200) {
    return {
      notFound: true,
    };
  }

  //Check if idea not of current user
  if (detailUser.user._id !== detailIdea.idea.user_id._id) {
    return {
      notFound: true,
    };
  }

  //Get all data categories
  const allCategories: IallCategories = await fetch(`${process.env.CLIENT_URL}/api/categories`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
      authorization: detailUser.accessToken.token,
    } as HeadersInit,
  }).then((e) => e.json());

  return {
    props: {
      detailIdea,
      allCategories,
    },
  };
};
