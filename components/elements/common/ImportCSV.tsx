import { CloseOutlined, TableOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space, Tooltip } from 'antd';
import { GlobalContext } from 'contextApi/globalContext';
import Image from 'next/image';
import { CSSProperties, useContext, useState } from 'react';
import { formatFileSize, useCSVReader } from 'react-papaparse';

export interface IImportCSVProps {
  fieldsValid: string[];
  onSubmit: (data: any) => Promise<void>;
}

//Style Import CSV
const styles = {
  zone: {
    alignItems: 'center',
    border: `1px dashed #009F9D`,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    padding: 20,
    cursor: 'pointer',
  } as CSSProperties,
};

export default function ImportCSV({ fieldsValid, onSubmit }: IImportCSVProps) {
  const {color2} = useContext(GlobalContext)

  //State data covert from csv
  const [dataCSV, setDataCSV] = useState<any>(null);

  //Setting modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (Array.isArray(dataCSV)) {
      onSubmit(dataCSV);
    }
    setIsModalVisible(false);
    setDataCSV(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setDataCSV(null);
  };

  //Setting import csv
  const { CSVReader } = useCSVReader();

  //Conver data array[array[]] to array[object]
  const convertData = (data: [][]) => {
    let result = [];
    for (let index = 1; index < data.length - 1; index++) {
      let arrItem = data[index];
      const arrItemConver = {
        index: index,
      };
      for (let index = 0; index < arrItem.length; index++) {
        arrItemConver[data[0][index]] = arrItem[index];
      }
      result.push(arrItemConver);
    }
    return result;
  };

  return (
    <>
      <Tooltip title={'Import csv to add employees'}>
        <Button
          onClick={showModal}
          type="primary"
          className={`${color2}`}
          icon={<TableOutlined />}
          style={{
            borderRadius: 5,
          }}
        />
      </Tooltip>
      <Modal
        title="Add employees by csv"
        visible={isModalVisible}
        onOk={handleOk}
        okText={'Add'}
        okButtonProps={{
          disabled: !dataCSV,
          className: `${color2}`
        }}
        onCancel={handleCancel}
      >
        <CSVReader
          onUploadAccepted={({ data }: any) => {
            if (data && Array.isArray(data)) {
              //initial check valid fields
              let acceptFile: boolean = true;

              //Check field data
              (data[0] as string[]).forEach((field) => {
                if (!fieldsValid.includes(field)) {
                  acceptFile = false;
                }
              });

              //Check if valid field false
              if (!acceptFile) {
                message.error({
                  content: `Your data CSV must have all field inclue ${fieldsValid.toString()}.`,
                });
              } else {
                if (data.length != 0) {
                  const dataConvert = convertData(data);
                  setDataCSV(dataConvert);
                }
              }
            }
          }}
        >
          {({ getRootProps, acceptedFile, getRemoveFileProps }: any) => (
            <>
              <div {...getRootProps()} style={styles.zone}>
                {acceptedFile ? (
                  <Space
                    size={20}
                    style={{
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Space size={20}>
                      <Image width={50} height={50} src={'/assets/files/excel.svg'} alt={'File svg'} />
                      <Space direction="vertical">
                        <span>{formatFileSize(acceptedFile.size)} </span>
                        <span>{acceptedFile.name}</span>
                      </Space>
                    </Space>
                    <Space
                      align="center"
                      style={{
                        borderRadius: '50%',
                        border: '2px solid #FF7070',
                        width: 30,
                        height: 30,
                        justifyContent: 'center',
                      }}
                    >
                      <div {...getRemoveFileProps()}>
                        <CloseOutlined
                          onClick={() => {
                            setDataCSV(null);
                          }}
                          style={{
                            color: '#FF7070',
                          }}
                        />
                      </div>
                    </Space>
                  </Space>
                ) : (
                  'Drop CSV file here or click to upload'
                )}
              </div>
            </>
          )}
        </CSVReader>
      </Modal>
    </>
  );
}
