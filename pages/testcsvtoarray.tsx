import React, { CSSProperties } from 'react';

import { useCSVReader, formatFileSize } from 'react-papaparse';

const styles = {
  zone: {
    alignItems: 'center',
    border: `2px dashed #009F9D`,
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    padding: 20,
  } as CSSProperties,
};

export default function CSVReader() {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        console.log(results);
      }}
    >
      {({ getRootProps, acceptedFile, getRemoveFileProps, Remove }: any) => (
        <>
          <div {...getRootProps()} style={styles.zone}>
            {acceptedFile ? (
              <>
                <span>{formatFileSize(acceptedFile.size)} </span>
                <span>{acceptedFile.name}</span>
                <div {...getRemoveFileProps()}>
                  <Remove />
                </div>
              </>
            ) : (
              'Drop CSV file here or click to upload'
            )}
          </div>
        </>
      )}
    </CSVReader>
  );
}
