import { Input as AntInput, Space } from 'antd';
import React from 'react';
import { Controller } from 'react-hook-form';
import { IInput } from '../../models';

export const TextArea = ({ formSetting, name, label, require = true }: IInput) => {

  const {
    formState: { errors },
    control,
  } = formSetting;
  return (
    <Space direction="vertical" size={'small'}>
      <span className="font-2">
        {label} {require && <span className="color-red">*</span>}
      </span>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <AntInput.TextArea
            {...field}
            size="large"
            style={{
                width: '100%',
                minHeight: '100px',
                borderRadius: 5
            }}
          />
        )}
      />
      {errors[name] && <span className="color-red">{errors[name].message}</span>}
    </Space>
  );
};
